
FROM python:3.14

copy requirements.txt /fast-api/

WORKDIR ./fast-api

RUN apt-get update && apt-get install -y --no-install-recommends \
    vim \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade -r ./requirements.txt


CMD ["fastapi", "run", "app/main.py", "--port", "8080"]