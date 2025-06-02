import React from 'react';
import VehicleMovementProblem from './components';

const Ex1: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          实验一：移动车辆问题
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          使用 BFS 和 A* 算法解决车辆移动问题
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <VehicleMovementProblem />
      </div>
    </div>
  );
};

export default Ex1;