import os
from pathlib import Path

import mysql.connector

# Database configuration
DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "database": os.getenv("DB_NAME", "currency_exchange"),
}


def run_migration():
    """Execute schema.sql to initialize the database"""
    try:
        # Connect to MySQL server (without specifying database first)
        conn = mysql.connector.connect(
            host=DB_CONFIG["host"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
        )
        cursor = conn.cursor()

        # Create database if it doesn't exist
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {DB_CONFIG['database']}")
        cursor.execute(f"USE {DB_CONFIG['database']}")

        # Read and execute schema.sql
        schema_path = Path(__file__).parent / "schema.sql"
        with open(schema_path, "r") as f:
            schema_sql = f.read()

        # Execute each statement
        for statement in schema_sql.split(";"):
            statement = statement.strip()
            if statement:
                cursor.execute(statement)

        conn.commit()
        print(f"✓ Database '{DB_CONFIG['database']}' initialized successfully")

    except mysql.connector.Error as err:
        print(f"✗ Error: {err}")
        return False
    except FileNotFoundError:
        print("✗ Error: schema.sql not found")
        return False
    finally:
        if "cursor" in locals():
            cursor.close()
        if "conn" in locals():
            conn.close()

    return True


if __name__ == "__main__":
    run_migration()
