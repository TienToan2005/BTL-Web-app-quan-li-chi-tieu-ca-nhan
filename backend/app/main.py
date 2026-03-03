from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Expense Manager API is running"}