import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3001";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "1m", target: 50 },
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<400"],
    http_req_failed: ["rate<0.01"],
  },
};

export default function () {
  const r1 = http.get(`${BASE_URL}/api/category`);
  check(r1, { "category 200": (r) => r.status === 200 });

  const r2 = http.get(`${BASE_URL}/api/health`);
  check(r2, { "health 200": (r) => r.status === 200 });

  sleep(1);
}
