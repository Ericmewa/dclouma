import React, { useState } from "react";
import { Table, Tag, Button, Space, Card, Typography, message, Modal } from "antd";
import {
    PoweroffOutlined,
    SwapOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";
import ReassignModal from "./ReassignModal";
import { useGetUsersQuery, useReassignTasksMutation, useToggleActiveMutation } from "../../api/userApi";
// import {
//     useGetUsersQuery,
//     useToggleActiveMutation,
//     useReassignTasksMutation,
// } from "../../api/userApi";

const { Title, Text } = Typography;
const { confirm } = Modal;

const DeactivatedUsers = () => {
    const { data: users = [], isLoading, refetch } = useGetUsersQuery();
    const [toggleActive] = useToggleActiveMutation();
    const [reassignTasks, { isLoading: isReassigning }] = useReassignTasksMutation();
    const [reassignModalOpen, setReassignModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Filter only deactivated users
    const deactivatedUsers = users.filter((u) => !u.active);

    const handleActivate = async (userId) => {
        console.log('=== handleActivate called ===');
        console.log('userId:', userId);
        console.log('userId type:', typeof userId);
        console.log('toggleActive function:', toggleActive);

        try {
            console.log('=== Calling toggleActive directly ===');
            console.log('About to call toggleActive with:', userId);

            const result = await toggleActive(userId).unwrap();

            console.log('=== toggleActive SUCCESS ===');
            console.log('Result:', result);

            message.success("User activated successfully");
            await refetch();
            console.log('Data refetched after activation');
        } catch (err) {
            console.error('=== toggleActive ERROR ===');
            console.error('Full error:', err);
            console.error('Error status:', err?.status);
            console.error('Error data:', err?.data);
            console.error('Error message:', err?.data?.message || err?.message);

            message.error(err?.data?.message || err?.message || "Failed to activate user");
        }
    };

    const handleReassign = (user) => {
        setSelectedUser(user);
        setReassignModalOpen(true);
    };

    const handleConfirmReassign = async (fromUserId, toUserId) => {
        try {
            await reassignTasks({ fromUserId, toUserId }).unwrap();
            message.success("Tasks reassigned successfully!");
            setReassignModalOpen(false);
            refetch();
        } catch (err) {
            message.error(err?.data?.message || "Failed to reassign tasks");
        }
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: "red",
            rm: "orange",
            cocreator: "green",
            cochecker: "purple",
            customer: "blue",
            approver: "cyan",
        };
        return colors[role] || "default";
    };

    // Filter available users for reassignment (same role and active)
    const getAvailableUsersForReassignment = (currentUser) => {
        if (!currentUser) return [];
        return users.filter(
            (u) => u._id !== currentUser._id && u.role === currentUser.role && u.active
        );
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            render: (name) => <Text strong>{name}</Text>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            filters: [
                { text: "RM", value: "rm" },
                { text: "CO Creator", value: "cocreator" },
                { text: "CO Checker", value: "cochecker" },
                { text: "Approver", value: "approver" },
                { text: "Customer", value: "customer" },
                { text: "Admin", value: "admin" },
            ],
            onFilter: (value, record) => record.role === value,
            render: (role) => (
                <Tag color={getRoleColor(role)} className="capitalize">
                    {role}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "active",
            key: "active",
            render: () => <Tag color="volcano">Inactive</Tag>,
        },
        {
            title: "Deactivated At",
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                const availableUsers = getAvailableUsersForReassignment(record);
                // Check database flag for reassignment status
                const hasBeenReassigned = record.tasksReassigned === true;
                return (
                    <Space>
                        <Button
                            size="small"
                            type="primary"
                            icon={<SwapOutlined />}
                            onClick={() => handleReassign(record)}
                            disabled={availableUsers.length === 0 || hasBeenReassigned}
                        >
                            {hasBeenReassigned ? "Reassigned" : "Reassign Tasks"}
                        </Button>
                        <Button
                            size="small"
                            type="default"
                            icon={<PoweroffOutlined />}
                            onClick={() => handleActivate(record._id)}
                            style={{ color: '#52c41a', borderColor: '#52c41a' }}
                        >
                            Activate
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <div style={{ padding: 24 }}>
            <Card
                style={{
                    borderRadius: 10,
                    boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ marginBottom: 20 }}>
                    <Title level={3}>Deactivated Users</Title>
                    <Text type="secondary">
                        {deactivatedUsers.length} inactive user{deactivatedUsers.length !== 1 ? "s" : ""}
                    </Text>
                </div>

                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={deactivatedUsers}
                    loading={isLoading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} deactivated users`,
                    }}
                    locale={{
                        emptyText: "No deactivated users found",
                    }}
                />
            </Card>

            <ReassignModal
                visible={reassignModalOpen}
                onClose={() => setReassignModalOpen(false)}
                onConfirm={handleConfirmReassign}
                currentUser={selectedUser}
                availableUsers={getAvailableUsersForReassignment(selectedUser)}
                loading={isReassigning}
            />
        </div>
    );
};

export default DeactivatedUsers;
