#!/bin/bash
cd frontend && npm run build && rm -rf ../backend/dist && cp -r dist ../backend/dist
