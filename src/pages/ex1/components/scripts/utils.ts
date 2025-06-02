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
   * @property {number[][]} parkingState - 二维数组表示的车道状态，parkingState[i][j]表示第i个车道第j个位置的车辆编号（0表示空位）
   * @property {Move[]} moves - 从初始状态到当前状态所执行的移动操作序列
   */
  interface State {
    parkingState: number[][];
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
   * @param laneCount 车道数，表示停车场的车道数量
   * @param spaceCount 每个车道的空间数，表示每个车道可以停放的车位数量
   * @returns 所有符合规则的可能移动操作数组
   */
  function generatePossibleMoves(state: number[][], laneCount: number, spaceCount: number): Move[] {
    const moves: Move[] = [];
  
    // 遍历每个车道
    for (let fromLane = 0; fromLane < laneCount; fromLane++) {
      // 遍历车道的每个位置
      for (let fromSpace = 0; fromSpace < spaceCount; fromSpace++) {
        if (state[fromLane][fromSpace] > 0) {
          const carId = state[fromLane][fromSpace];
  
          // 在同一车道内尝试所有可能的移动位置
          for (let toSpace = 0; toSpace < spaceCount; toSpace++) {
            if (toSpace !== fromSpace && state[fromLane][toSpace] === 0) {
              // 确定移动方向并检查路径是否有阻挡
              const [start, end] = toSpace < fromSpace
                ? [toSpace + 1, fromSpace]  // 向左移动
                : [fromSpace + 1, toSpace]; // 向右移动
  
              if (state[fromLane].slice(start, end).every(cell => cell === 0)) {
                moves.push({
                  from: { lane: fromLane, space: fromSpace },
                  to: { lane: fromLane, space: toSpace },
                  car: carId
                });
              }
            }
          }
  
          // 最后尝试移动到其他车道
          if (state[fromLane].slice(fromSpace + 1).every(cell => cell === 0)) {
            for (let toLane = 0; toLane < laneCount; toLane++) {
              if (toLane === fromLane) continue;
              for (let toSpace = 0; toSpace < spaceCount; toSpace++) {
                // 检查目标车位右侧是否有阻挡
                if (state[toLane][toSpace] === 0 && state[toLane].slice(toSpace + 1).every(cell => cell === 0)) {
                  moves.push({
                    from: { lane: fromLane, space: fromSpace },
                    to: { lane: toLane, space: toSpace },
                    car: carId
                  });
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
    return stateToString(state1) === stateToString(state2);
  }


// 批量导出
export {
    type Move,
    type State,
    generatePossibleMoves,
    applyMove,
    stateToString,
    isStateEqual
  };