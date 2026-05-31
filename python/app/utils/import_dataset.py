import csv
import json
import asyncio

from app.utils.database import chatbot_dataset

CHUNK_SIZE = 1000


async def insert_chunk(chunk):

    if chunk:

        await chatbot_dataset.insert_many(
            chunk,
            ordered=False
        )

        print(
            f"Inserted {len(chunk)}"
        )


async def import_dataset():

    print("Import Started")

    await chatbot_dataset.delete_many(
        {}
    )

    chunk = []

    total = 0

    with open(
        "dataset.csv",
        "r",
        encoding="utf-8"
    ) as file:

        reader = csv.DictReader(
            file
        )

        for row in reader:

            try:

                row["entities"] = json.loads(
                    row.get(
                        "entities_json",
                        "{}"
                    )
                )

            except:

                row["entities"] = {}

            row.pop(
                "entities_json",
                None
            )

            chunk.append(
                row
            )

            total += 1

            if len(chunk) >= CHUNK_SIZE:

                await insert_chunk(
                    chunk
                )

                chunk = []

        if chunk:

            await insert_chunk(
                chunk
            )

    print(
        f"DONE {total}"
    )


if __name__ == "__main__":

    asyncio.run(
        import_dataset()
    )