from flask import Flask, render_template, jsonify
import vam_distance

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route('/map')
def map():
    return render_template('map.html')

@app.route('/get_vam_coords')
def get_vam_coords():
    # Retrieve the vam_coords value from the vam_distance module
    vam_coords = vam_distance.vam_coords_list
    print(vam_coords)

    response = []

    for coords in vam_coords:
        response.append({
            'latitude': coords[0],
            'longitude': coords[1]
        })

        # Clear the vamCoords list
        vam_coords.clear()

    #print(response)  # Print the response to the command line

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
