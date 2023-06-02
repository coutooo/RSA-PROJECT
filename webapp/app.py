from flask import Flask, render_template, jsonify, request, redirect, url_for, flash
import json
import rsu1_sim,rsu2_sim
import subprocess
import requests
import secrets
import sqlite3
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

app.secret_key = secrets.token_hex(16)

current_directory = os.getcwd()
database_path = os.path.join(current_directory, 'restaurant.db')

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{database_path}'
db = SQLAlchemy(app)

# Define the Restaurant model
class Restaurant(db.Model):
    __tablename__ = 'restaurants'  # Specify the table name
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True)
    cid = db.Column(db.String(64))

    def __init__(self, name, cid):
        self.name = name
        self.cid = cid

# Create the database tables
with app.app_context():
    db.create_all()
    print("Tables created successfully!")


@app.route("/")
def index():
    message = request.args.get('message')
    if(message != None):
        return render_template('index.html', message=message)
    else:
        return render_template("index.html")

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/get_vam_coords')
def get_vam_coords():
    # Retrieve the vam_coords value from the rsu1_sim module
    #RSU 1
    vam_coords = rsu1_sim.vam_coords_list

    response = []

    for coords in vam_coords:
        if coords[2]==2:
            response.append({
                'latitude': coords[0],
                'longitude': coords[1],
            })
    # Clear the vamCoords list
    vam_coords.clear()

    return jsonify(response)

@app.route('/get_vam_coords2')
def get_vam_coords2():
    # Retrieve the vam_coords value from the rsu2_sim module
    #RSU 1
    vam_coords = rsu2_sim.vam_coords_list

    response = []

    for coords in vam_coords:
        if coords[2]==4:
            response.append({
                'latitude': coords[0],
                'longitude': coords[1],
            })
    # Clear the vamCoords list
    vam_coords.clear()

    return jsonify(response)

@app.route('/submit_info', methods=['GET', 'POST'])
def submit_info():
    if request.method == 'POST':
        # Get the form data
        restaurant = request.form['restaurant']
        id = int(request.form['id'])

        # Delete the old CID for the restaurant in ipfs
        old_restaurant = Restaurant.query.filter_by(name=restaurant).first()
        if old_restaurant:
            old_cid = old_restaurant.cid
            delete_cid(old_cid)  # Function to delete the old CID

        # Parse the menu items
        menu_items = []
        menu_count = 0
        while True:
            name = request.form.get(f'menu_name_{menu_count}')
            price = request.form.get(f'menu_price_{menu_count}')
            description = request.form.get(f'menu_description_{menu_count}')
            if name is None or price is None or description is None:
                break
            menu_items.append({
                'name': name,
                'price': float(price),
                'description': description
            })
            menu_count += 1

        # Parse the available tables
        available_tables = []
        table_count = 0
        while True:
            table_id = request.form.get(f'table_id_{table_count}')
            seats = request.form.get(f'table_seats_{table_count}')
            if table_id is None or seats is None:
                break
            available_tables.append({
                'id': int(table_id),
                'seats': int(seats)
            })
            table_count += 1

        # Create the JSON object
        data = {
            'restaurant': restaurant,
            'id': id,
            'menu': menu_items,
            'available_tables': available_tables
        }

        # Convert to JSON string
        json_data = json.dumps(data, indent=4) 

        file_name = f'files/{restaurant.replace(" ", "_")}.json'

        # Save the JSON string to a file
        with open(file_name, 'w') as file:
            file.write(json_data)

        # Update IPFS Cluster with the file
        url = 'http://127.0.0.1:5001/api/v0/add'
        file_path = file_name
        files = {'file': open(file_path, 'rb')}
        response = requests.post(url, files=files)

        # Get the CID from the response
        data = response.json()
        cid = data['Hash']

        # Update or create the restaurant in the database
        restaurant = Restaurant.query.filter_by(name=restaurant).first()
        if restaurant:
            restaurant.cid = cid
        else:
            restaurant = Restaurant(name=restaurant, cid=cid)
            db.session.add(restaurant)
        
        # Commit the changes to the database
        db.session.commit()

        # Display success message
        flash('Data has been updated and synced to IPFS Cluster successfully!', 'success')

        # Redirect to the index page with a success message
        return redirect(url_for('index', message='Data updated successfully!'))
    
    return render_template('submit_info.html')

@app.route('/get_cid', methods=['GET'])
def get_cid():
    # Get the restaurant name from the query parameters
    restaurant_name = request.args.get('restaurant')

    print(restaurant_name)

    # Check if the restaurant name is provided
    if restaurant_name:
        # Query the Restaurant table for the specified restaurant
        restaurant_data = Restaurant.query.filter_by(name=restaurant_name).first()

        print(restaurant_data.cid)

        if restaurant_data:
            # Return the CID as a string
            return str(restaurant_data.cid)

    # Return an error message if the restaurant is not found or the name is not provided
    return 'Restaurant not found or name not provided'

def delete_cid(cid):
    url = f'http://localhost:5001/api/v0/pin/rm/{cid}'  # IPFS REST API endpoint
    response = requests.delete(url)
    if response.status_code == 200:
        return True
    else:
        return False


if __name__ == "__main__":
    app.run(debug=True)
