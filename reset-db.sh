#!/bin/bash

rm ./prisma/festival.db
npx prisma db push
npx prisma db seed