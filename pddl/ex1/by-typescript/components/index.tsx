import React, { useState } from 'react';
// 在文件开头添加 A* 算法的导入
import { solveParkingProblem } from './scripts/solverBFS';
import { solveParkingProblemAStar } from './scripts/solverA*';

// 车道和车位的状态
interface CarLaneProps {
  laneCount: number;
  spaceCount: number;
  onStateChange: (state: number[][]) => void;
}

// 车辆车道组件
const CarLane: React.FC<CarLaneProps> = ({ laneCount, spaceCount, onStateChange }) => {
  const [state, setState] = useState<number[][]>(() =>
    Array(laneCount).fill(null).map(() => Array(spaceCount).fill(0))
  );

  // 添加 useEffect 来监听 laneCount 和 spaceCount 的变化
  React.useEffect(() => {
    const newState = Array(laneCount).fill(null).map(() => Array(spaceCount).fill(0));
    setState(newState);
    onStateChange(newState);
  }, [laneCount, spaceCount, onStateChange]);

  // 处理车辆数量输入框的变化
  const handleCarNumberChange = (laneIndex: number, spaceIndex: number, value: string) => {
    const newState = [...state];
    newState[laneIndex][spaceIndex] = parseInt(value) || 0;
    setState(newState);
    onStateChange(newState);
  };

  // 动态渲染车辆车道
  return (
    <div className="space-y-4">
      {state.map((lane, laneIndex) => (
        <div key={laneIndex} className="flex space-x-4">
          {lane.map((car, spaceIndex) => (
            <input
              key={spaceIndex}
              type="number"
              min="0"
              value={car || ''}
              onChange={(e) => handleCarNumberChange(laneIndex, spaceIndex, e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white hover:bg-gray-50"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// 车辆移动问题组件
const VehicleMovementProblem: React.FC = () => {
  const [laneCount, setLaneCount] = useState(2);
  const [spaceCount, setSpaceCount] = useState(3);
  const [initialState, setInitialState] = useState<number[][]>([]);
  const [targetState, setTargetState] = useState<number[][]>([]);
  const [movementSteps, setMovementSteps] = useState<string[]>([]);
  
  // 添加一个新的状态来区分不同算法的结果
  const [algorithmType, setAlgorithmType] = useState<'BFS' | 'A*'>('BFS');

  // 修改原有的 handleSolve 函数
  const handleSolve = (type: 'BFS' | 'A*') => {
    setAlgorithmType(type);
    const solution = type === 'BFS' 
      ? solveParkingProblem(laneCount, spaceCount, initialState, targetState)
      : solveParkingProblemAStar(laneCount, spaceCount, initialState, targetState);

    if (solution) {
      const steps = solution.map((move, index) => {
        const fromLane = move.from.lane + 1;
        const toLane = move.to.lane + 1;
        const fromSpace = move.from.space + 1;
        const toSpace = move.to.space + 1;
        return `步骤${index + 1}: 移动车辆${move.car}从车道${fromLane}的第${fromSpace}个车位到车道${toLane}的第${toSpace}个车位`;
      });
      setMovementSteps(steps);
    } else {
      setMovementSteps(['无法找到解决方案']);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">初始状态</h3>
          <CarLane laneCount={laneCount} spaceCount={spaceCount} onStateChange={setInitialState} />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">目标状态</h3>
          <CarLane laneCount={laneCount} spaceCount={spaceCount} onStateChange={setTargetState} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            车道数量
          </label>
          <input
            type="number"
            min="1"
            value={laneCount}
            onChange={(e) => setLaneCount(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white hover:bg-gray-50"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            每个车道的车位数量
          </label>
          <input
            type="number"
            min="1"
            value={spaceCount}
            onChange={(e) => setSpaceCount(parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:ring-1 focus:ring-gray-400 focus:border-gray-400 bg-white hover:bg-gray-50"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => handleSolve('BFS')}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-colors border border-gray-200"
        >
          使用BFS算法求解
        </button>
        <button
          onClick={() => handleSolve('A*')}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 transition-colors border border-gray-200"
        >
          使用A*算法求解
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          移动步骤 ({algorithmType}算法)
        </h3>
        <ul className="space-y-2">
          {movementSteps.map((step, index) => (
            <li
              key={index}
              className="p-3 bg-white rounded-md shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {step}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VehicleMovementProblem;