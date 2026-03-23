import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';

const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: fromIni(),
});

const TABLE_NAME = 'thefretshed-progress';

async function tableExists() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    return true;
  } catch (e) {
    if (e.name === 'ResourceNotFoundException') return false;
    throw e;
  }
}

async function createTable() {
  const command = new CreateTableCommand({
    TableName: TABLE_NAME,
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'sk',     AttributeType: 'S' },
    ],
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH'  },
      { AttributeName: 'sk',     KeyType: 'RANGE' },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  });
  const result = await client.send(command);
  return result.TableDescription;
}

async function main() {
  console.log(`Checking for table: ${TABLE_NAME}...`);
  if (await tableExists()) {
    console.log(`✅ Table "${TABLE_NAME}" already exists — nothing to do.`);
    return;
  }
  console.log(`Creating table "${TABLE_NAME}"...`);
  const table = await createTable();
  console.log(`✅ Table created!`);
  console.log(`   Status: ${table.TableStatus}`);
  console.log(`   ARN:    ${table.TableArn}`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
