import numpy as np
import os
from flask_pymongo import PyMongo
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
import json
from flask import Flask, jsonify, render_template, send_file, request, url_for, redirect
#from flask_json import FlaskJSON, JsonError, json_response, as_json
# from bson.json_util import dumps



#################################################
# Database Setup Mongo
#################################################

# Create connection variable
# conn = 'mongodb://localhost:27017'

# # Pass connection to the pymongo instance.
# client = PyMongo.MongoClient(conn)

# Connect to a database. Will create one if not already available.
# db = client.COVID_19
# collection = db.MNCounties


# Use flask_pymongo to set up mongo connection

# app = Flask(__name__)
# app.config["MONGO_URI"] = "mongodb://localhost:27017/COVID_19"
# mongo = PyMongo(app)

# Or set inline
# mongo = PyMongo(app, uri="mongodb://localhost:27017/COVID_19")


#################################################
# Database Setup Postgres
#################################################

connection_string = "postgres:postgres@localhost:5432/covid_db"
engine = create_engine(f'postgresql://{connection_string}')

# reflect an existing database into a new model
Base = automap_base()
# # reflect the tables
Base.prepare(engine, reflect=True)



# Save reference to the table
Counties = Base.classes.counties
# print(Counties)
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
# FlaskJSON(app)


#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    # print(Counties)
    return render_template("index.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/data_tables")
def data_tables():
    return render_template("data_tables.html")

@app.route("/visuals")
def visuals():

# write a statement that finds all the items in the db and sets it to a variable
    # countylist = list(db.collection.find())
    # print(countylist)


    # Return the template with the teams list passed in
    return render_template('visuals.html')
    # return render_template('visuals.html', countylist=countylist)

@app.route("/data")
def counties():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return a list of county data including the total population, population over 65, and percentage over 65"""
    # Query all passengers
    results = session.query(Counties.cty_name, Counties.pop, Counties.over_65_total, Counties.percent_over_65).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_counties = []
    for name, pop, ovr65, pct65 in results:
        counties_dict = {}
        counties_dict["cty_name"] = name
        counties_dict["pop"] = pop
        counties_dict["over_65_total"] = ovr65
        counties_dict["percent_over_65"] = pct65
        all_counties.append(counties_dict)

    return jsonify(all_counties)
    # return json_response(results)

@app.route('/geodata')
# https://stackoverflow.com/questions/45910122/retriving-json-from-flask-endpoint
def get_county_geojson():

    # parent_path = '\\'.join(os.path.realpath(__file__).split('\\')[:-1])
    # file_path = os.path.join(parent_path, 'data\\MN_counties.geojson')
    path = "data/MN_counties.geojson"
    with open(path, 'r') as file_data:
        json_data = json.load(file_data)
    return jsonify(json_data)

@app.route('/covid_geodata')
# https://stackoverflow.com/questions/45910122/retriving-json-from-flask-endpoint
def get_covid_geojson():

    # parent_path = '\\'.join(os.path.realpath(__file__).split('\\')[:-1])
    # file_path = os.path.join(parent_path, 'data\\COVID19_Cases_US.geojson')
    path = "data/COVID19_Cases_US.geojson"
    with open(path, 'r') as file_data:
        json_data = json.load(file_data)
    return jsonify(json_data)



if __name__ == '__main__':
    app.run(debug=True)

