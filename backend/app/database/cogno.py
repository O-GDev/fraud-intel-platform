import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


load_dotenv()


COGNO_URI = os.getenv("COGNO_URI")
COGNO_USERNAME = os.getenv("COGNO_USERNAME")
COGNO_PASSWORD = os.getenv("COGNO_PASSWORD")


if not COGNO_URI:
    raise RuntimeError("COGNO_URI is not configured")

if not COGNO_USERNAME:
    raise RuntimeError("COGNO_USERNAME is not configured")

if not COGNO_PASSWORD:
    raise RuntimeError("COGNO_PASSWORD is not configured")


driver = GraphDatabase.driver(
    COGNO_URI,
    auth=(COGNO_USERNAME, COGNO_PASSWORD)
)


def verify_connection():
    driver.verify_connectivity()
    return True

def close_connetion():
    driver.close()
