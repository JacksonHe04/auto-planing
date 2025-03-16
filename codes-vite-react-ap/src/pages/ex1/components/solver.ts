/**
 * 表示一个移动操作，包括车辆的来源位置、目标位置和车辆编号
 * @interface Move
 * @property {Object} from - 车辆的起始位置
 * @property {number} from.lane - 起始车道编号（从0开始）
 * @property {number} from.space - 起始车位编号（从0开始）
 * @property {Object} to - 车辆的目标位置
 * @property {number} to.lane - 目标车道编号（从0开始）
 * @property {number} to.space - 目标车位编号（从0开始）
 * @property {number} car - 车辆编号（大于0的整数）
 */
interface Move {
  from: { lane: number; space: number };
  to: { lane: number; space: number };
  car: number;
}

/**
 * 表示游戏的状态，包括车道的车辆分布和已进行的移动操作
 * @interface State
 * @property {number[][]} lanes - 二维数组表示的车道状态，lanes[i][j]表示第i个车道第j个位置的车辆编号（0表示空位）
 * @property {Move[]} moves - 从初始状态到当前状态所执行的移动操作序列
 */
interface State {
  lanes: number[][];
  moves: Move[];
}

/**
 * 根据当前车道状态、车道数和每个车道的空间数，生成所有可能的车辆移动方式
 * 该函数实现了车辆移动规则的核心逻辑，包括：
 * 1. 检查车辆是否可以从当前位置移出（右侧是否有阻挡）
 * 2. 优先尝试在同一车道内向左移动（减少车道变换）
 * 3. 如果无法向左移动，尝试在同一车道内向右移动
 * 4. 最后尝试移动到其他车道（需要考虑目标车道的阻挡情况）
 * 
 * @param state 当前车道状态，二维数组表示每个位置的车辆编号（0表示空位）
 * @param n 车道数，表示停车场的车道数量
 * @param a 每个车道的空间数，表示每个车道可以停放的车位数量
 * @returns 所有符合规则的可能移动操作数组
 */
function generatePossibleMoves(state: number[][], n: number, a: number): Move[] {
  const moves: Move[] = [];

  // 对于每个车道
  for (let fromLane = 0; fromLane < n; fromLane++) {
    // 检查每个位置的车
    for (let fromSpace = 0; fromSpace < a; fromSpace++) {
      if (state[fromLane][fromSpace] > 0) {
        const car = state[fromLane][fromSpace];

        // 检查是否可以移出当前位置（右侧是否有阻挡）
        let canMoveOut = true;
        for (let i = fromSpace + 1; i < a; i++) {
          if (state[fromLane][i] > 0) {
            canMoveOut = false;
            break;
          }
        }

        if (canMoveOut) {
          // 优先尝试在同一车道内向左移动
          for (let toSpace = 0; toSpace < fromSpace; toSpace++) {
            if (state[fromLane][toSpace] === 0) {
              // 检查目标位置左侧是否有阻挡
              let canMoveIn = true;
              for (let i = 0; i < toSpace; i++) {
                if (state[fromLane][i] > 0) {
                  canMoveIn = false;
                  break;
                }
              }

              // 检查当前位置左侧是否有阻挡
              for (let i = toSpace + 1; i < fromSpace; i++) {
                if (state[fromLane][i] > 0) {
                  canMoveIn = false;
                  break;
                }
              }

              if (canMoveIn) {
                moves.push({
                  from: { lane: fromLane, space: fromSpace },
                  to: { lane: fromLane, space: toSpace },
                  car
                });
              }
            }
          }

          // 尝试在同一车道内向右移动
          for (let toSpace = fromSpace + 1; toSpace < a; toSpace++) {
            if (state[fromLane][toSpace] === 0) {
              let canMoveIn = true;
              // 检查目标位置右侧是否有阻挡
              for (let i = toSpace + 1; i < a; i++) {
                if (state[fromLane][i] > 0) {
                  canMoveIn = false;
                  break;
                }
              }

              // 检查当前位置右侧是否有阻挡
              for (let i = fromSpace + 1; i < toSpace; i++) {
                if (state[fromLane][i] > 0) {
                  canMoveIn = false;
                  break;
                }
              }

              if (canMoveIn) {
                moves.push({
                  from: { lane: fromLane, space: fromSpace },
                  to: { lane: fromLane, space: toSpace },
                  car
                });
              }
            }
          }

          // 最后尝试移动到其他车道
          for (let toLane = 0; toLane < n; toLane++) {
            if (toLane !== fromLane) {
              for (let toSpace = 0; toSpace < a; toSpace++) {
                if (state[toLane][toSpace] === 0) {
                  let canMoveIn = true;

                  // 检查目标车道右侧是否有阻挡
                  for (let i = toSpace + 1; i < a; i++) {
                    if (state[toLane][i] > 0) {
                      canMoveIn = false;
                      break;
                    }
                  }

                  // 检查目标车道左侧是否有阻挡
                  for (let i = 0; i < toSpace; i++) {
                    if (state[toLane][i] > 0) {
                      let canMove = false;
                      for (let otherLane = 0; otherLane < n; otherLane++) {
                        if (otherLane !== toLane) {
                          let hasSpace = false;
                          for (let j = 0; j < a; j++) {
                            if (state[otherLane][j] === 0) {
                              hasSpace = true;
                              break;
                            }
                          }
                          if (hasSpace) {
                            canMove = true;
                            break;
                          }
                        }
                      }
                      if (!canMove) {
                        canMoveIn = false;
                        break;
                      }
                    }
                  }

                  if (canMoveIn) {
                    moves.push({
                      from: { lane: fromLane, space: fromSpace },
                      to: { lane: toLane, space: toSpace },
                      car
                    });
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return moves;
}

/**
 * 根据移动操作更新车道状态
 * 该函数通过以下步骤更新状态：
 * 1. 创建当前状态的深拷贝以避免修改原始状态
 * 2. 将车辆从原位置移除（设置为0）
 * 3. 将车辆放置到新位置
 * 
 * @param state 当前车道状态，二维数组表示每个位置的车辆编号
 * @param move 要执行的移动操作，包含车辆的起始位置和目标位置
 * @returns 执行移动操作后的新车道状态
 */
function applyMove(state: number[][], move: Move): number[][] {
  const newState = state.map(lane => [...lane]);
  newState[move.from.lane][move.from.space] = 0;
  newState[move.to.lane][move.to.space] = move.car;
  return newState;
}

/**
 * 将车道状态转换为字符串表示，用于状态比较和缓存
 * 将二维数组转换为一维字符串，每个车道用分隔符连接
 * 
 * @param state 车道状态，二维数组表示每个位置的车辆编号
 * @returns 字符串表示的车道状态，用于唯一标识一个状态
 */
function stateToString(state: number[][]): string {
  return state.map(lane => lane.join(',')).join(';');
}

/**
 * 检查两个车道状态是否相等
 * @param state1 第一个车道状态
 * @param state2 第二个车道状态
 * @returns 如果两个车道状态相等则返回true，否则返回false
 */
function isStateEqual(state1: number[][], state2: number[][]): boolean {
  if (state1.length !== state2.length) return false;
  for (let i = 0; i < state1.length; i++) {
    if (state1[i].length !== state2[i].length) return false;
    for (let j = 0; j < state1[i].length; j++) {
      if (state1[i][j] !== state2[i][j]) return false;
    }
  }
  return true;
}

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
 * @param n 车道数，表示停车场的车道数量
 * @param a 每个车道的空间数，表示每个车道可以停放的车位数量
 * @param initialState 初始状态，二维数组表示初始的车辆分布
 * @param targetState 目标状态，二维数组表示期望的车辆分布
 * @returns 如果存在解决方案，返回移动步骤序列；如果无解，返回null
 */
export function solveParkingProblem(n: number, a: number, initialState: number[][], targetState: number[][]): Move[] | null {
  // 初始化搜索队列，将初始状态加入
  const queue: State[] = [];
  const visited = new Set<string>();

  // 初始状态
  const initialStateObj = { lanes: initialState, moves: [] };
  queue.push(initialStateObj);
  visited.add(stateToString(initialState));

  // BFS主循环
  while (queue.length > 0) {
    const current = queue.shift()!;

    // 检查是否达到目标状态
    if (isStateEqual(current.lanes, targetState)) {
      return current.moves;
    }

    // 生成所有可能的移动操作
    const possibleMoves = generatePossibleMoves(current.lanes, n, a);

    // 对每个可能的移动，创建新状态
    for (const move of possibleMoves) {
      const newState = applyMove(current.lanes, move);
      const newStateStr = stateToString(newState);

      // 如果新状态未访问过，加入队列继续搜索
      if (!visited.has(newStateStr)) {
        visited.add(newStateStr);
        const newStateObj = {
          lanes: newState,
          moves: [...current.moves, move]
        };
        queue.push(newStateObj);
      }
    }
  }

  // 搜索完所有可能状态仍未找到解，返回null
  return null;
}