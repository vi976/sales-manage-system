# TruEstate – Sales Management System

## Overview
A responsive Sales Management System that supports search, multi-select filtering, sorting, and pagination across a 50k sales dataset. Implemented with React frontend (Vite) and Node.js + Express + MongoDB backend.

## Tech Stack
**Frontend:** React (Vite), Axios, Lucide Icons  
**Backend:** Node.js, Express, Mongoose  
**Database:** MongoDB Atlas  
**Deployment:** Vercel (Frontend), Render (Backend)

## Search Implementation Summary
- Case-insensitive search on customer name and phone number  
- Server-side filtering for accuracy on large datasets  
- Debounced input on frontend

## Filter Implementation Summary
- Multi-select filters: Region, Gender, Category, Tags, Payment Method  
- Range filters: Age, Date Range  
- Combined filtering implemented using MongoDB aggregation pipeline  
- Indexes added for performance

## Sorting Implementation Summary
- Server-side sorting by date, quantity, or customer name  
- Controlled via sortField and sortDir query parameters

## Pagination Implementation Summary
- Server-side pagination  
- Default page size: 10  
- API returns { results, total }  

## Setup Instructions

### Backend
`ash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI to .env
npm run import
npm start
cd frontend
npm install
npm run dev
--
