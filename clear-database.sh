#!/bin/bash

# Command to stop and remove containers, start containers, apply migrations and seed the database
sudo docker compose down &&  sudo docker compose up -d && pnpm prisma migrate deploy && pnpm prisma db seed

