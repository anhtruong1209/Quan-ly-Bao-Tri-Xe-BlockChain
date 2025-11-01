import pandas as pd
from catboost import CatBoostRegressor
import numpy as np
import sys
import json

def predict_price(input_data):
    try:
        # Chuyển đổi đầu vào từ JSON thành DataFrame
        input_df = pd.DataFrame([input_data])

        # Nạp lại mô hình đã lưu
        model = CatBoostRegressor()
        model.load_model('./best_model')

        # Dự đoán giá
        prediction = model.predict(input_df)
        predicted_price = np.power(10, prediction[0])

        return predicted_price

    except Exception as e:
        print(f'Error in predict_price: {e}')
        return None

# Nhận đầu vào từ command line
if __name__ == '__main__':
    input_data = json.loads(sys.argv[1])
    predicted_price = predict_price(input_data)
    if predicted_price is not None:
        print(predicted_price)
    else:
        print('Error during prediction')

