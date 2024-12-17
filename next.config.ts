import type { NextConfig } from "next";

const nextConfig: NextConfig = {
images:{
  remotePatterns:[
    {
      protocol:"https",
      hostname:"nextdoor-bucket.s3.ap-south-1.amazonaws.com",      
    }
  ]
}

};

export default nextConfig;
