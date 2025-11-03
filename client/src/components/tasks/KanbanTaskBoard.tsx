import React, { useState, useMemo, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, User, Clock, Calendar } from 'lucide-react';
import { Task } from '@/types/projects';
import CreateTaskModal from './CreateTaskModal';

interface KanbanTaskBoardProps {
  tasks: Task[];
  projectId: string;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
}

type TaskStatus = 'todo' | 'in-progress' | 'review' | 'completed';

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'Review', color: 'bg-yellow-500' },
  { id: 'completed', title: 'Completed', color: 'bg-green-500' },
];

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    animateLayoutChanges: () => true,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'transform 150ms ease-out' : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  // Store ref callback to ensure we can access the element
  const setRefs = (node: HTMLElement | null) => {
    setNodeRef(node);
    if (node) {
      node.setAttribute('data-id', task.id);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      ref={setRefs}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-card border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-lg transition-shadow ${
        isDragging ? 'ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm mb-1 truncate">{task.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        </div>
        <div className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground flex-shrink-0">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className={`text-xs ${getPriorityColor(task.priority)} text-white border-0`}
        >
          {task.priority}
        </Badge>
      </div>

      <div className="space-y-1 text-xs text-muted-foreground">
        {task.assignee && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{task.assignee}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Est: {task.estimatedHours}h</span>
          {task.actualHours > 0 && (
            <span className="text-green-600">| Act: {task.actualHours}h</span>
          )}
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface DroppableColumnProps {
  id: string;
  children: React.ReactNode;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`transition-all duration-200 ${
        isOver ? 'bg-muted/30 ring-2 ring-primary ring-offset-2 rounded-lg' : ''
      }`}
    >
      {children}
    </div>
  );
};

const KanbanTaskBoard: React.FC<KanbanTaskBoardProps> = ({
  tasks,
  projectId,
  onTaskUpdate,
  onTaskCreate,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalStatus, setCreateModalStatus] = useState<TaskStatus>('todo');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pointerOffset, setPointerOffset] = useState<{ x: number; y: number } | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Reduced for quicker response
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      'in-progress': [],
      review: [],
      completed: [],
    };

    tasks.forEach((task) => {
      if (task.status in grouped) {
        grouped[task.status as TaskStatus].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active, activatorEvent } = event;
    const task = tasks.find((t) => t.id === active.id);
    setActiveTask(task || null);
    setActiveId(active.id as string);
    
    // Calculate offset from pointer position to element top-left
    if (activatorEvent && 'clientX' in activatorEvent && 'clientY' in activatorEvent) {
      const mouseEvent = activatorEvent as MouseEvent;
      const mouseX = mouseEvent.clientX;
      const mouseY = mouseEvent.clientY;
      
      // Find element immediately
      const element = document.querySelector(`[data-id="${active.id}"]`) as HTMLElement;
      
      if (element) {
        const rect = element.getBoundingClientRect();
        // Calculate offset: where mouse clicked relative to element's top-left corner
        const offsetX = mouseX - rect.left;
        const offsetY = mouseY - rect.top;
        setPointerOffset({ x: offsetX, y: offsetY });
      } else {
        // Default offset (roughly center of typical card - width 280px, height ~120px)
        setPointerOffset({ x: 140, y: 60 });
      }
    } else {
      setPointerOffset({ x: 140, y: 60 });
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over, activatorEvent } = event;
    
    // Track mouse position for smooth scrolling
    if (activatorEvent && 'clientX' in activatorEvent && 'clientY' in activatorEvent) {
      const mouseEvent = activatorEvent as MouseEvent;
      setMousePosition({ x: mouseEvent.clientX, y: mouseEvent.clientY });
      
      // Auto-scroll columns when dragging near edges
      columnRefs.current.forEach((scrollContainer) => {
        if (!scrollContainer) return;
        
        const rect = scrollContainer.getBoundingClientRect();
        const scrollThreshold = 60; // pixels from edge
        const scrollSpeed = 8; // pixels per frame
        
        // Check if mouse is near top or bottom of column
        if (
          mouseEvent.clientX >= rect.left &&
          mouseEvent.clientX <= rect.right &&
          mouseEvent.clientY >= rect.top &&
          mouseEvent.clientY <= rect.bottom
        ) {
          const distanceFromTop = mouseEvent.clientY - rect.top;
          const distanceFromBottom = rect.bottom - mouseEvent.clientY;
          
          // Scroll up if near top
          if (distanceFromTop < scrollThreshold && scrollContainer.scrollTop > 0) {
            scrollContainer.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
          }
          // Scroll down if near bottom
          else if (
            distanceFromBottom < scrollThreshold &&
            scrollContainer.scrollTop < scrollContainer.scrollHeight - scrollContainer.clientHeight
          ) {
            scrollContainer.scrollBy({ top: scrollSpeed, behavior: 'auto' });
          }
        }
      });
    }
    
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active task
    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    // Check if over a column
    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn && activeTask.status !== targetColumn.id) {
      // Update status in real-time for better UX
      // Note: We'll do the final update in handleDragEnd to avoid too many updates
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const overId = over.id as string;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) {
      setActiveTask(null);
      return;
    }

    // Check if dropping on a column (column id matches a task status)
    const targetColumn = columns.find((col) => col.id === overId);
    if (targetColumn && task.status !== targetColumn.id) {
      onTaskUpdate(taskId, { status: targetColumn.id });
    } else {
      // Dropping on another task - find which column it belongs to
      const targetTask = tasks.find((t) => t.id === overId);
      if (targetTask && task.status !== targetTask.status) {
        onTaskUpdate(taskId, { status: targetTask.status });
      }
    }

    setActiveTask(null);
    setActiveId(null);
    setPointerOffset(null);
    setMousePosition(null);
    
    // Clear any scroll intervals
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  const handleCreateTask = (status: TaskStatus) => {
    setCreateModalStatus(status);
    setIsCreateModalOpen(true);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-full">
            {columns.map((column, index) => {
              const columnTasks = tasksByStatus[column.id];
              const isLast = index === columns.length - 1;
              return (
                <DroppableColumn key={column.id} id={column.id}>
                  <div 
                    className={`flex flex-col h-full min-h-[500px] ${
                      !isLast ? 'border-r border-border/50' : ''
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-border/50 flex-shrink-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${column.color}`}
                          />
                          <CardTitle className="text-sm font-semibold">
                            {column.title}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {columnTasks.length}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => handleCreateTask(column.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div 
                      ref={(el) => {
                        if (el) {
                          columnRefs.current.set(column.id, el);
                        } else {
                          columnRefs.current.delete(column.id);
                        }
                      }}
                      className="flex-1 overflow-y-auto min-h-[400px] max-h-[600px] px-4 py-3 scroll-smooth"
                    >
                      <SortableContext
                        items={columnTasks.map((t) => t.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-2">
                          {columnTasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                          ))}
                          {columnTasks.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground text-sm">
                              <p>No tasks</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2"
                                onClick={() => handleCreateTask(column.id)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Task
                              </Button>
                            </div>
                          )}
                        </div>
                      </SortableContext>
                    </div>
                  </div>
                </DroppableColumn>
              );
            })}
          </div>
        </Card>

        <DragOverlay
          dropAnimation={{
            duration: 300,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          style={{
            cursor: 'grabbing',
          }}
          adjustScale={false}
        >
          {activeTask && pointerOffset ? (
            <div 
              className="relative"
              style={{
                transform: `translate(-${pointerOffset.x}px, -${pointerOffset.y}px)`,
                pointerEvents: 'none',
                willChange: 'transform',
                transition: 'transform 80ms ease-out',
              }}
            >
              <div className="bg-card border-2 border-primary rounded-lg p-3 shadow-2xl w-[280px]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 truncate">{activeTask.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {activeTask.description}
                  </p>
                </div>
                <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${(() => {
                    switch (activeTask.priority) {
                      case 'urgent': return 'bg-red-500';
                      case 'high': return 'bg-orange-500';
                      case 'medium': return 'bg-yellow-500';
                      case 'low': return 'bg-blue-500';
                      default: return 'bg-gray-500';
                    }
                  })()} text-white border-0`}
                >
                  {activeTask.priority}
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {activeTask.assignee && (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span className="truncate">{activeTask.assignee}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Est: {activeTask.estimatedHours}h</span>
                </div>
              </div>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(taskData) => {
          onTaskCreate({ ...taskData, projectId, status: createModalStatus });
          setIsCreateModalOpen(false);
        }}
      />
    </>
  );
};

export default KanbanTaskBoard;

