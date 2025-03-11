import React, { useState } from 'react';
import './styles.css';
import { solveParkingProblem } from './solver';

interface CarLaneProps {
  laneCount: number;
  spaceCount: number;
  onStateChange: (state: number[][]) => void;
}

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

  const handleCarNumberChange = (laneIndex: number, spaceIndex: number, value: string) => {
    const newState = [...state];
    newState[laneIndex][spaceIndex] = parseInt(value) || 0;
    setState(newState);
    onStateChange(newState);
  };

  return (
    <div className="car-lane">
      {state.map((lane, laneIndex) => (
        <div key={laneIndex} className="lane">
          {lane.map((car, spaceIndex) => (
            <input
              key={spaceIndex}
              type="number"
              min="0"
              value={car || ''}
              onChange={(e) => handleCarNumberChange(laneIndex, spaceIndex, e.target.value)}
              className="car-space"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const VehicleMovementProblem: React.FC = () => {
  const [laneCount, setLaneCount] = useState(2);
  const [spaceCount, setSpaceCount] = useState(3);
  const [initialState, setInitialState] = useState<number[][]>([]);
  const [targetState, setTargetState] = useState<number[][]>([]);
  const [movementSteps, setMovementSteps] = useState<string[]>([]);

  const handleSolve = () => {
    const solution = solveParkingProblem(laneCount, spaceCount, initialState, targetState);
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
    <div className="vehicle-movement-problem">
      <h2>移动车辆问题</h2>
      <div className="controls">
        <label>
          车道数量:
          <input
            type="number"
            min="1"
            value={laneCount}
            onChange={(e) => setLaneCount(parseInt(e.target.value) || 1)}
          />
        </label>
        <label>
          每个车道的车位数量:
          <input
            type="number"
            min="1"
            value={spaceCount}
            onChange={(e) => setSpaceCount(parseInt(e.target.value) || 1)}
          />
        </label>
      </div>
      <div className="states">
        <div>
          <h3>初始状态</h3>
          <CarLane laneCount={laneCount} spaceCount={spaceCount} onStateChange={setInitialState} />
        </div>
        <div>
          <h3>目标状态</h3>
          <CarLane laneCount={laneCount} spaceCount={spaceCount} onStateChange={setTargetState} />
        </div>
      </div>
      <button onClick={handleSolve}>求解</button>
      <div className="movement-steps">
        <h3>移动步骤</h3>
        <ul>
          {movementSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VehicleMovementProblem;