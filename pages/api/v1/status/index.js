import database from "infra/database.js";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();

    const dataBaseVersionResult = await database.query("SHOW server_version;");
    const dbVersion = dataBaseVersionResult.rows[0].server_version;

    const showMaxConnections = await database.query("SHOW max_connections;");
    const maxConnections = showMaxConnections.rows[0].max_connections;

    const showOpenedConnections = await database.query(
      "SELECT count(*)::int FROM pg_stat_activity WHERE datname = 'local_db';",
    );
    const currentConnections = showOpenedConnections.rows[0].count;

    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: dbVersion,
          max_connections: parseInt(maxConnections),
          opened_connections: currentConnections,
        },
      },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Erro ao acessar o banco de dados" });
  }
}

export default status;
