"use client"


import axios from "axios";

const baseURL =   process.env.NEXT_PUBLIC_API || "http://localhost:8006";

export const axiosAuthorized = axios.create({
    baseURL: baseURL,
});

export const axiosInstance = axios.create({
    baseURL: baseURL,
});