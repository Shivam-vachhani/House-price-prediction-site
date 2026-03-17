from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import json
import numpy as np
import os

app = Flask(__name__)
CORS(app)


model = pickle.load(open('house_price_model.pkl', 'rb'))

with open('area_mapping_.json', 'r') as f:
    area_data = json.load(f)

mapping     = area_data['mapping']
global_mean = area_data['global_mean']


FURNISH_MAP = {
    'unfurnished'    : 0,
    'semi-furnished' : 1,
    'furnished'      : 2
}


@app.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'House Price Prediction API is running'})


@app.route('/areas', methods=['GET'])
def get_areas():
    """Return sorted list of all areas for the dropdown in React"""
    areas = sorted(list(mapping.keys()))
    return jsonify({'areas': areas})


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()


        required = ['area', 'bhk', 'furnishing', 'area_sqft',
                    'is_new_property', 'floor', 'total_floors']
        for field in required:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400


        area_sqft      = float(data['area_sqft'])
        bhk            = float(data['bhk'])
        is_new         = int(data['is_new_property'])  
        area           = data['area'].strip().lower()


        furnishing_raw = data['furnishing']
        if isinstance(furnishing_raw, str):
            is_furnished = FURNISH_MAP.get(furnishing_raw.lower(), 0)
        else:
            is_furnished = int(furnishing_raw)


        floor        = float(data['floor'])
        total_floors = float(data['total_floors'])
        if total_floors <= 0:
            return jsonify({'error': 'total_floors must be greater than 0'}), 400
        relative_floor = floor / total_floors

        
        area_encoded = mapping.get(area, global_mean)

        features = np.array([[
            area_sqft,        
            relative_floor,  
            bhk,             
            is_new,         
            is_furnished,     
            area_encoded      
        ]])

 
        log_price = model.predict(features)[0]
        price = np.expm1(log_price)
        return jsonify({
            'predicted_price' : round(float(price), 5),
            'area_encoded'    : round(area_encoded, 2),
            'relative_floor'  : round(relative_floor, 4),
            'status'          : 'success'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)