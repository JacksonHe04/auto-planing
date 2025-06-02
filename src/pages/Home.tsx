import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl md:text-6xl">
          自动规划
        </h1>
        <p className="text-xl text-gray-600">课程实验演示</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full transform transition-all duration-300 hover:scale-105">
        <div className="text-center space-y-4">
          <div className="text-2xl font-semibold text-gray-800">学生信息</div>
          <div className="text-gray-600">
            <p className="text-lg">学号：58122307</p>
            <p className="text-lg">姓名：何锦诚</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;