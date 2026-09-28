import subprocess
import sys
import time
import os

def run():
    print("=" * 60)
    print("  CAMPUSFLOW AI — MULTI-SERVICE LAUNCHER")
    print("  Amazon Developer Hackathon (Alexa+ Track)")
    print("=" * 60)

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    py_exec = sys.executable

    # 1. Start MCP Server on 8001
    print("\n[1/3] Starting CampusFlow MCP Server (Port 8001)...")
    mcp_proc = subprocess.Popen([
        py_exec, "-m", "uvicorn", "mcp_server.server:app", "--host", "127.0.0.1", "--port", "8001", "--reload"
    ], cwd=base_dir)

    # 2. Start Backend API on 8000
    print("[2/3] Starting CampusFlow Backend API (Port 8000)...")
    api_proc = subprocess.Popen([
        py_exec, "-m", "uvicorn", "backend.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"
    ], cwd=base_dir)

    # 3. Start Next.js Frontend on 3000
    print("[3/3] Starting Next.js Frontend (Port 3000)...")
    frontend_dir = os.path.join(base_dir, "frontend")
    front_proc = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        shell=True
    )

    print("\nAll CampusFlow services running!")
    print("-> Frontend:    http://localhost:3000")
    print("-> Backend API: http://127.0.0.1:8000/docs")
    print("-> MCP Server:  http://127.0.0.1:8001/mcp/tools")
    print("\nPress Ctrl+C to terminate all services.\n")

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down services...")
        mcp_proc.terminate()
        api_proc.terminate()
        front_proc.terminate()
        print("Done.")

if __name__ == "__main__":
    run()
