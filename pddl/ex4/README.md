在PDDL（Planning Domain Definition Language）中，时间规划用于处理涉及时间因素的规划问题，带时序的电梯规划问题就是其中一个典型示例。该任务旨在通过PDDL语言，对电梯系统中的各种动作（如电梯移动、乘客进出电梯等）进行建模，并规划出能在满足时间约束的情况下，将所有乘客送到目标楼层的方案，同时优化总执行时间。任务具体描述如下：
1. **定义领域（Domain）**
    - **声明需求（Requirements）**：在领域定义中，添加`:typing`（用于类型声明）、`:fluents`（处理流，即随时间变化的状态属性）和`:durative-actions`（表示使用持续动作）到`:requirements`列表，以表明该领域涉及时间规划和复杂动作建模。
    - **定义类型（Types）**：定义领域中使用的对象类型，如`elevator`（电梯）、`passenger`（乘客）和`num`（用于表示楼层的数字）。
    - **定义谓词（Predicates）**：包括`passenger-at ?person - passenger ?floor - num`（表示乘客在某楼层）、`boarded ?person - passenger ?lift - elevator`（表示乘客已登上某电梯）、`lift-at ?lift - elevator ?floor - num`（表示电梯在某楼层）以及`next ?n1 - num ?n2 - num`（表示楼层间的相邻关系） ，用于描述领域中的状态。
    - **定义函数（Functions）**：定义如`person_speed ?person - passenger`（表示乘客速度）、`elevator_speed ?lift - elevator`（表示电梯速度）和`floor_distance ?f1 ?f2 - num`（表示楼层间距离）等函数，用于计算动作的持续时间。
    - **定义动作（Actions）**
        - **电梯移动动作**：定义`move-up`和`move-down`动作。以`move-up`为例，其参数包括电梯`?lift`、当前楼层`?cur`和目标楼层`?nxt`。持续时间通过`(= ?duration (/ (floor_distance ?cur ?nxt) (elevator_speed ?lift)))`计算，即楼层距离除以电梯速度。条件包括在动作开始时电梯在当前楼层`(at start (lift-at ?lift ?cur))` ，且在动作执行期间当前楼层和目标楼层相邻`(over all (next ?cur ?nxt))`。效果是在动作开始时电梯离开当前楼层`(at start (not (lift-at ?lift ?cur)))` ，在动作结束时到达目标楼层`(at end (lift-at ?lift ?nxt))`。
        - **乘客进出电梯动作**：定义`board`和`leave`动作。例如`board`动作，参数有乘客`?per`、楼层`?flr`和电梯`?lift`，持续时间为乘客速度`(= ?duration (person_speed ?per))`。条件是在动作执行期间电梯在该楼层`(over all (lift-at ?lift ?flr))`且乘客在该楼层`(at start (passenger-at ?per ?flr))`。效果是动作开始时乘客离开该楼层`(at start (not (passenger-at ?per ?flr)))` ，结束时登上电梯`(at end (boarded ?per ?lift))`。
2. **定义问题（Problem）**
    - **指定领域（Domain）**：明确该问题所属的领域为上述定义的` temporal-elevators`领域。
    - **定义对象（Objects）**：列出问题中涉及的具体对象，如多个楼层（用`n1`、`n2`等表示）、多个乘客（如`p1`、`p2`等）和多个电梯（如`e1`、`e2`等） ，并指定它们所属的类型。
    - **设置初始状态（Init）**：包括楼层间的相邻关系（如`(next n1 n2)` ）、电梯和乘客的初始位置（如`(lift-at e1 n1)` 、`(passenger-at p1 n2)` ），以及定义每个乘客的速度、电梯的速度和楼层间的距离等函数值。
    - **设定目标（Goal）**：明确规划的目标，如将所有乘客送到特定楼层，例如`(and (passenger-at p1 n1) (passenger-at p2 n1) (passenger-at p3 n1))`表示将乘客`p1`、`p2`、`p3`都送到楼层`n1`。
    - **设置优化指标（Metric）**：添加`(:metric minimize (total-time))` ，表示希望找到一个总执行时间最短的规划方案。
3. **考虑特殊情况和扩展**
    - **并发执行（Required Concurrency）**：在规划过程中，可能存在一些动作必须重叠执行才能使方案有效的情况。例如，当添加`open-door`动作（打开电梯门），并修改`board`和`leave`动作，使其要求在动作执行期间门保持打开状态`(over all (open ?lift))`时，就出现了乘客进出电梯动作与开门动作的并发需求。只有乘客速度足够快，能在开门动作持续时间内完成进出电梯动作，即`(person_speed ?per) < (door_speed ?lift)`，该方案才有效。
    - **动作非重叠限制（Forcing Action Non - Overlap）**：可以通过使用一元资源来强制某些动作不重叠。例如，修改`open-door`动作，添加`can-stop-at`谓词，在动作开始时要求该谓词成立，动作执行期间删除该谓词，动作结束时重新添加。这样可以限制在同一时间只有一部电梯能在特定楼层开门，实现动作非重叠限制。
    - **限制规划时长（Restricting Plan Duration）**：PDDL本身没有专门机制指定最大规划时长，但可以通过创建一个辅助动作`execute`来实现。添加`(enabled)`谓词作为每个动作的总体条件，并添加`(can-execute)`谓词到领域和初始状态。定义`execute`动作，其持续时间设为最大规划时长（如10个时间单位），在动作开始时启用`(enabled)`并删除`(can-execute)` ，结束时禁用`(enabled)`。由于`(can-execute)`只在`execute`动作开始时可用且之后不会被其他动作添加，所以`execute`动作只能执行一次，且其他所有动作必须在`execute`动作的持续时间内完成，从而限制了整个规划的时长。 