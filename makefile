CC = g++
CFLAGS = -std=c++11 -O2 -Wall -Wextra -Wshadow -g -Wfatal-errors -I/src

all: sukupuu
	$(CC) sukupuu.cpp $(CFLAGS) -o sukupuu

