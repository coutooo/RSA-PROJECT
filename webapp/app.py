from flask import Flask, render_template, jsonify
import rsu1_sim,rsu2_sim

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/get_vam_coords')
def get_vam_coords():
    # Retrieve the vam_coords value from the rsu1_sim module
    #RSU 1
    vam_coords = rsu1_sim.vam_coords_list
    print(vam_coords)

    response = []

    for coords in vam_coords:
        if coords[2]==2:
            response.append({
                'latitude': coords[0],
                'longitude': coords[1],
            })
    # Clear the vamCoords list
    vam_coords.clear()

    #print(response)  # Print the response to the command line

    return jsonify(response)

@app.route('/get_vam_coords2')
def get_vam_coords2():
    # Retrieve the vam_coords value from the rsu2_sim module
    #RSU 1
    vam_coords = rsu2_sim.vam_coords_list
    print(vam_coords)

    response = []

    for coords in vam_coords:
        if coords[2]==4:
            response.append({
                'latitude': coords[0],
                'longitude': coords[1],
            })
    # Clear the vamCoords list
    vam_coords.clear()

    #print(response)  # Print the response to the command line

    return jsonify(response)

if __name__ == "__main__":
    app.run(debug=True)
