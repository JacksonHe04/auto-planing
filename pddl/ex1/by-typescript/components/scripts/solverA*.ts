import { 
  type Move,
  generatePossibleMoves,
  applyMove,
  stateToString,
  isStateEqual
} from './utils';

/**
 * 表示A*算法中的节点状态
 */
interface AStarNode {
  parkingState: number[][];
  moves: Move[];
  g: number;  // 从起始状态到当前状态的实际代价（移动次数）
  h: number;  // 启发式估计值：从当前状态到目标状态的估计代价
  f: number;  // f = g + h，总估计代价
}

/**
 * 计算启发式值：估计从当前状态到目标状态所需的最小移动次数
 */
function heuristic(currentState: number[][], targetState: number[][]): number {
  let totalCost = 0;
  const positions = new Map<number, { lane: number; space: number }>();

  // 记录目标状态中每个车辆的位置
  for (let lane = 0; lane < targetState.length; lane++) {
    for (let space = 0; space < targetState[lane].length; space++) {
      const car = targetState[lane][space];
      if (car > 0) {
        positions.set(car, { lane, space });
      }
    }
  }

  // 计算每辆车的代价
  for (let lane = 0; lane < currentState.length; lane++) {
    for (let space = 0; space < currentState[lane].length; space++) {
      const car = currentState[lane][space];
      if (car > 0) {
        const target = positions.get(car);
        if (target) {
          // 基础代价：曼哈顿距离
          const manhattanDistance = Math.abs(lane - target.lane) + Math.abs(space - target.space);
          
          // 额外代价：考虑车道变换的惩罚
          const laneChangePenalty = lane !== target.lane ? 2 : 0;
          
          // 额外代价：考虑被阻挡的情况
          let blockingPenalty = 0;
          if (lane === target.lane) {
            const [start, end] = space < target.space 
              ? [space + 1, target.space]
              : [target.space + 1, space];
            
            // 检查路径上是否有其他车辆阻挡
            for (let i = start; i < end; i++) {
              if (currentState[lane][i] > 0) {
                blockingPenalty += 3;
              }
            }
          }

          totalCost += manhattanDistance + laneChangePenalty + blockingPenalty;
        }
      }
    }
  }

  return totalCost;
}

/**
 * 使用A*算法解决停车场重排问题
 */
export function solveParkingProblemAStar(
  laneCount: number,
  spaceCount: number,
  initialState: number[][],
  targetState: number[][]
): Move[] | null {
  const openSet: AStarNode[] = [];
  const visited = new Set<string>();
  const gScores = new Map<string, number>();

  // 初始节点
  const initialNode: AStarNode = {
    parkingState: initialState,
    moves: [],
    g: 0,
    h: heuristic(initialState, targetState),
    f: heuristic(initialState, targetState)
  };

  openSet.push(initialNode);
  gScores.set(stateToString(initialState), 0);

  while (openSet.length > 0) {
    // 获取f值最小的节点
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;
    const currentStateStr = stateToString(current.parkingState);

    // 检查是否达到目标状态
    if (isStateEqual(current.parkingState, targetState)) {
      return current.moves;
    }

    // 标记当前状态为已访问
    visited.add(currentStateStr);

    // 生成所有可能的移动操作
    const possibleMoves = generatePossibleMoves(current.parkingState, laneCount, spaceCount);

    // 探索所有可能的下一个状态
    for (const move of possibleMoves) {
      const newState = applyMove(current.parkingState, move);
      const newStateStr = stateToString(newState);

      // 如果该状态已经访问过，跳过
      if (visited.has(newStateStr)) {
        continue;
      }

      // 计算通过当前节点到达新状态的g值
      const tentativeG = current.g + 1;

      // 如果找到了更好的路径或者这是第一次访问该状态
      if (!gScores.has(newStateStr) || tentativeG < gScores.get(newStateStr)!) {
        gScores.set(newStateStr, tentativeG);
        const h = heuristic(newState, targetState);
        const newNode: AStarNode = {
          parkingState: newState,
          moves: [...current.moves, move],
          g: tentativeG,
          h: h,
          f: tentativeG + h
        };

        // 将新节点添加到开放列表
        openSet.push(newNode);
      }
    }
  }

  return null;
}