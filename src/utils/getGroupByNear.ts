import type { AddressPoint } from "@/schemas/addressSchema";

// 1. 거리 계산 헬퍼 (유지)
const getSquaredDistance = (
  a: Pick<AddressPoint, "lat" | "lng">,
  b: Pick<AddressPoint, "lat" | "lng">,
) => {
  return (a.lat - b.lat) ** 2 + (a.lng - b.lng) ** 2;
};

// 2. 그룹 내부 선 꼬임 방지 헬퍼 (유지)
const sortPathInsideGroup = (group: AddressPoint[]) => {
  if (group.length <= 1) return group;
  const pool = [...group];
  const path = [pool.shift()!];
  while (pool.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;
    const current = path[path.length - 1];
    for (let i = 0; i < pool.length; i++) {
      const dist = getSquaredDistance(current, pool[i]);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    path.push(pool.splice(nearestIdx, 1)[0]);
  }
  return path;
};

// 3. ⭐️ 핵심: '정원 제한'이 추가된 균형 K-Means 군집화 알고리즘
export default function groupByBalancedKMeans(points: AddressPoint[], k: number): AddressPoint[][] {
  if (k <= 0) return [];
  if (k >= points.length) return points.map((p) => [p]);

  const targetCapacity = Math.ceil(points.length / k);

  const centroids = Array.from({ length: k }).map((_, i) => {
    const seedPoint = points[Math.floor((i * points.length) / k)];
    return { lat: seedPoint.lat, lng: seedPoint.lng };
  });

  let changed = true;
  let iterations = 0;
  const MAX_ITER = 20;
  let finalAssignments: number[] = new Array(points.length).fill(-1);

  while (changed && iterations < MAX_ITER) {
    changed = false;
    iterations++;

    const assignments: number[] = new Array(points.length).fill(-1);
    const clusterCounts = new Array(k).fill(0);
    let unassignedCount = points.length;

    // ⭐️ 핵심: 체육대회 턴제 뽑기 (Round-Robin Draft)
    while (unassignedCount > 0) {
      let pickedInThisRound = false;

      // K명의 조장이 한 번씩 돌아가면서 픽(Pick)합니다.
      for (let j = 0; j < k; j++) {
        // 이미 자기 팀 정원을 다 채운 조장은 턴을 넘깁니다.
        if (clusterCounts[j] >= targetCapacity) continue;
        if (unassignedCount === 0) break;

        let minDist = Infinity;
        let bestPointIdx = -1;

        // 남은 사람 중 자기랑 가장 가까운 1명을 찾습니다.
        for (let i = 0; i < points.length; i++) {
          if (assignments[i] === -1) {
            const dist = getSquaredDistance(points[i], centroids[j]);
            if (dist !== undefined && dist < minDist) {
              minDist = dist;
              bestPointIdx = i;
            }
          }
        }

        // 찾은 사람을 자기 팀으로 데려옵니다.
        if (bestPointIdx !== -1) {
          assignments[bestPointIdx] = j;
          clusterCounts[j]++;
          unassignedCount--;
          pickedInThisRound = true;
        }
      }

      // 무한 루프 안전망
      if (!pickedInThisRound) break;
    }

    // 중심점 재계산
    const newCentroids = Array.from({ length: k }, () => ({ lat: 0, lng: 0, count: 0 }));
    for (let i = 0; i < points.length; i++) {
      const cluster = assignments[i];
      if (cluster !== -1) {
        newCentroids[cluster].lat += points[i].lat;
        newCentroids[cluster].lng += points[i].lng;
        newCentroids[cluster].count++;
      }
    }

    for (let j = 0; j < k; j++) {
      if (newCentroids[j].count > 0) {
        const newLat = newCentroids[j].lat / newCentroids[j].count;
        const newLng = newCentroids[j].lng / newCentroids[j].count;

        if (centroids[j].lat !== newLat || centroids[j].lng !== newLng) {
          centroids[j].lat = newLat;
          centroids[j].lng = newLng;
          changed = true;
        }
      }
    }
    finalAssignments = [...assignments];
  }

  // 최종 결과 묶기 및 선 꼬임 방지 정렬
  const clusters: AddressPoint[][] = Array.from({ length: k }, () => []);
  for (let i = 0; i < points.length; i++) {
    const cluster = finalAssignments[i];
    if (cluster !== -1) {
      clusters[cluster].push(points[i]);
    }
  }

  return clusters
    .filter((cluster) => cluster.length > 0)
    .map((cluster) => sortPathInsideGroup(cluster));
}
