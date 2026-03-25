import axios from 'axios'

export const api = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
        'Content-Type': 'application/json',
    },
})

export type Branch = {
    id: number
    name: string
}

export type TaskGroup = {
    id: number
    name: string
}

export type TaskName = {
    id: number
    name: string
    taskGroupId: number
}

export type CreateBranchPayload = {
    name: string
}

export type CreateTaskGroupPayload = {
    name: string
}

export type CreateTaskNamePayload = {
    name: string
    taskGroupId: number
}

export type CreateTaskTypePayload = {
    branchId: number
    taskGroupId: number
    taskNameId: number
    startDate: string
    recommendation?: string
    timeSlots: Array<{
        dayOfWeek: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'
        startTime: string
        endTime: string
        capacity: number
    }>
}

export type UpdateTaskTypePayload = {
    startDate?: string
    recommendation?: string
    timeSlots?: Array<{
        dayOfWeek: 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'
        startTime: string
        endTime: string
        capacity: number
    }>
}

export const TaskAPI = {
    getBranches: () => api.get<Branch[]>('/api/branches').then((res) => res.data),
    createBranch: (data: CreateBranchPayload) => api.post('/api/branches', data).then((res) => res.data),

    getTaskGroups: () => api.get<TaskGroup[]>('/api/task-groups').then((res) => res.data),
    createTaskGroup: (data: CreateTaskGroupPayload) => api.post('/api/task-groups', data).then((res) => res.data),

    getTaskNames: (groupId?: number) => {
        const query = groupId ? `?groupId=${groupId}` : ''
        return api.get<TaskName[]>(`/api/task-names${query}`).then((res) => res.data)
    },
    createTaskName: (data: CreateTaskNamePayload) => api.post('/api/task-names', data).then((res) => res.data),

    getTaskTypes: () => api.get('/api/task-types').then((res) => res.data),
    createTaskType: (data: CreateTaskTypePayload) => api.post('/api/task-types', data).then((res) => res.data),
    updateTaskType: (id: number, data: UpdateTaskTypePayload) =>
        api.patch(`/api/task-types/${id}`, data).then((res) => res.data),
    deleteTaskType: (id: number) => api.delete(`/api/task-types/${id}`).then((res) => res.data),
}