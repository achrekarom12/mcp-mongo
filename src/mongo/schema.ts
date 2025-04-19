import { Collection } from "mongodb";
import { MongoFieldSchema, MongoCollectionSchema } from "../interfaces/mongo";

function inferSchemaFromValue(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  if (typeof value === "object") return "object";
  return typeof value;
}

function mergeFieldSchemas(
  existing: MongoFieldSchema[] = [],
  incoming: MongoFieldSchema[]
): MongoFieldSchema[] {
  const map = new Map<string, MongoFieldSchema>();

  for (const field of [...existing, ...incoming]) {
    const existingField = map.get(field.field);
    if (!existingField) {
      map.set(field.field, { ...field });
    } else {
      const types = new Set([
        ...(existingField.type.split("|")),
        ...(field.type.split("|")),
      ]);
      existingField.type = Array.from(types).sort().join("|");
      existingField.isRequired = existingField.isRequired && field.isRequired;

      if (field.subFields) {
        existingField.subFields = mergeFieldSchemas(
          existingField.subFields,
          field.subFields
        );
      }
    }
  }

  return Array.from(map.values());
}

function inferSchemaFromDocument(
  doc: Record<string, unknown>,
  parentPath = ""
): MongoFieldSchema[] {
  const schema: MongoFieldSchema[] = [];

  for (const [key, value] of Object.entries(doc)) {
    const fieldPath = parentPath ? `${parentPath}.${key}` : key;
    const fieldType = inferSchemaFromValue(value);
    const field: MongoFieldSchema = {
      field: fieldPath,
      type: fieldType,
      isRequired: true,
    };

    if (fieldType === "object" && value !== null) {
      field.subFields = inferSchemaFromDocument(
        value as Record<string, unknown>,
        fieldPath
      );
    } else if (fieldType === "array" && Array.isArray(value) && value.length > 0) {
      const elementTypes = new Set(value.map(inferSchemaFromValue));
      field.type = `array<${Array.from(elementTypes).sort().join("|")}>`;

      if (elementTypes.has("object")) {
        field.subFields = mergeFieldSchemas(
          [],
          inferSchemaFromDocument(
            value[0] as Record<string, unknown>,
            `${fieldPath}[]`
          )
        );
      }
    }

    schema.push(field);
  }

  return schema;
}

export async function buildCollectionSchema(
  collection: Collection,
  sampleSize = 100
): Promise<MongoCollectionSchema> {
  const docs = (await collection.find({}).limit(sampleSize).toArray()) as Record<
    string,
    unknown
  >[];
  const count = await collection.countDocuments();
  const indexes = await collection.indexes();

  const aggregatedSchemaMap = new Map<string, MongoFieldSchema>();
  const fieldPresenceMap = new Map<string, number>();

  for (const doc of docs) {
    const docSchema = inferSchemaFromDocument(doc);

    for (const field of docSchema) {
      // Track how many times each field appeared
      fieldPresenceMap.set(field.field, (fieldPresenceMap.get(field.field) || 0) + 1);

      if (!aggregatedSchemaMap.has(field.field)) {
        aggregatedSchemaMap.set(field.field, { ...field });
      } else {
        const existing = aggregatedSchemaMap.get(field.field)!;
        const types = new Set([...existing.type.split("|"), ...field.type.split("|")]);
        existing.type = Array.from(types).sort().join("|");

        // Merge subfields if any
        if (field.subFields) {
          existing.subFields = mergeFieldSchemas(
            existing.subFields,
            field.subFields
          );
        }
      }
    }
  }

  // Mark required fields (those present in all docs)
  const fields: MongoFieldSchema[] = [];
  for (const field of aggregatedSchemaMap.values()) {
    const presenceCount = fieldPresenceMap.get(field.field) || 0;
    field.isRequired = presenceCount === docs.length;
    fields.push(field);
  }

  return {
    collection: collection.collectionName,
    fields,
    count,
    indexes,
  };
}
