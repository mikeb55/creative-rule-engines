@echo off
cd /d "%~dp0.."
start /min "" py -m streamlit run app/streamlit_app.py --server.headless true
timeout /t 5 /nobreak > nul
start http://localhost:8501
