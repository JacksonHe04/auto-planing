import { 
  type Move,
  type State,
  generatePossibleMoves,
  applyMove,
  stateToString,
  isStateEqual
} from './utils';

/**
 * 使用广度优先搜索（BFS）算法解决停车场重排问题
 * 该函数通过以下步骤查找从初始状态到目标状态的最短移动序列：
 * 1. 初始化搜索队列，将初始状态加入队列
 * 2. 使用Set记录已访问的状态，避免重复搜索
 * 3. 对每个状态：
 *    - 检查是否达到目标状态
 *    - 生成所有可能的移动操作
 *    - 对每个可能的移动，创建新状态并加入队列（如果未访问过）
 * 4. 如果队列为空仍未找到解，则返回null表示无解
 * 
 * @param laneCount 车道数，表示停车场的车道数量
 * @param spaceCount 每个车道的空间数，表示每个车道可以停放的车位数量
 * @param initialState 初始状态，二维数组表示初始的车辆分布
 * @param targetState 目标状态，二维数组表示期望的车辆分布
 * @returns 如果存在解决方案，返回移动步骤序列；如果无解，返回null
 */
export function solveParkingProblem(laneCount: number, spaceCount: number, initialState: number[][], targetState: number[][]): Move[] | null {
  // 初始化搜索队列，将初始状态加入
  const queue: State[] = [];
  const visited = new Set<string>();

  // 初始状态
  const initialStateObj = { parkingState: initialState, moves: [] };
  queue.push(initialStateObj);
  visited.add(stateToString(initialState));

  // BFS主循环
  while (queue.length > 0) {
    const current = queue.shift()!;

    // 检查是否达到目标状态
    if (isStateEqual(current.parkingState, targetState)) {
      return current.moves;
    }

    // 生成所有可能的移动操作
    const possibleMoves = generatePossibleMoves(current.parkingState, laneCount, spaceCount);

    // 对每个可能的移动，创建新状态
    for (const move of possibleMoves) {
      const newState = applyMove(current.parkingState, move);
      const newStateStr = stateToString(newState);

      // 如果新状态未访问过，加入队列继续搜索
      if (!visited.has(newStateStr)) {
        visited.add(newStateStr);
        const newStateObj = {
          parkingState: newState,
          moves: [...current.moves, move]
        };
        queue.push(newStateObj);
      }
    }
  }

  // 搜索完所有可能状态仍未找到解，返回null
  return null;
}
