aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 272604832244.dkr.ecr.us-east-1.amazonaws.com
docker build -t covid-inc .
docker tag covid-inc:latest 272604832244.dkr.ecr.us-east-1.amazonaws.com/covid-inc:latest
docker push 272604832244.dkr.ecr.us-east-1.amazonaws.com/covid-inc:latest