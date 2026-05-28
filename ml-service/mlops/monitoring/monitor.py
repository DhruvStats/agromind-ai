from datetime import datetime

def log_prediction(text, result):
    with open("mlops/monitoring/log.txt", "a") as f:
        f.write(f"{datetime.now()} | Input: {text} | Output: {result}\n")

def show_logs():
    try:
        with open("mlops/monitoring/log.txt", "r") as f:
            print(f.read())
    except:
        print("No logs found")
