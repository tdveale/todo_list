FROM python:3.7-alpine

# work in backend subdirectory
WORKDIR /backend

# environmental vars for flask app
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV FLASK_RUN_PORT 8000

# install python dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# expose port 8000 for flask app
EXPOSE 8000

# copy all files from backend directory to container
COPY . .

# run flask app
CMD ["flask", "run"]