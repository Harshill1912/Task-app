import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as DocumentPicker from "expo-document-picker";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { getApiFileUrl } from "../api/client";
import { getErrorMessage } from "../api/error";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  uploadAttachment
} from "../api/tasks";
import { useAuth } from "../auth/AuthContext";
import { LogoMark } from "../components/LogoMark";
import { Task } from "../types/task";
import { colors, styles as sharedStyles } from "./styles";

type TaskFilter = "all" | "pending" | "completed";

const filters: { label: string; value: TaskFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" }
];

export function TasksScreen() {
  const { signOut, user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [attachmentType, setAttachmentType] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const invalidateTasks = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks"] });

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      closeTaskModal();
      invalidateTasks();
    }
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAttachment,
    onSuccess: (data) => {
      setAttachmentUrl(data.attachmentUrl || "");
      setAttachmentName(data.attachmentName || "");
      setAttachmentType(data.attachmentType || "");
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (task: Task) =>
      updateTask(task._id, { completed: !task.completed }),
    onSuccess: invalidateTasks
  });

  const editMutation = useMutation({
    mutationFn: (task: Task) =>
      updateTask(task._id, {
        title: title.trim(),
        description: description.trim() || undefined,
        attachmentUrl: attachmentUrl || undefined,
        attachmentName: attachmentName || undefined,
        attachmentType: attachmentType || undefined
      }),
    onSuccess: () => {
      closeTaskModal();
      invalidateTasks();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidateTasks
  });

  const tasks = tasksQuery.data || [];
  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );
  const completedPercent = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const visiblePendingTasks = filter === "completed" ? [] : pendingTasks;
  const visibleCompletedTasks = filter === "pending" ? [] : completedTasks;

  const saveTask = () => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!cleanTitle) {
      return;
    }

    if (editingTask) {
      editMutation.mutate(editingTask);
      return;
    }

    createMutation.mutate({
      title: cleanTitle,
      description: cleanDescription || undefined,
      attachmentUrl: attachmentUrl || undefined,
      attachmentName: attachmentName || undefined,
      attachmentType: attachmentType || undefined
    });
  };

  const openCreateTask = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setIsAddOpen(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setAttachmentUrl(task.attachmentUrl || "");
    setAttachmentName(task.attachmentName || "");
    setAttachmentType(task.attachmentType || "");
    setIsAddOpen(true);
  };

  const closeTaskModal = () => {
    setIsAddOpen(false);
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setAttachmentUrl("");
    setAttachmentName("");
    setAttachmentType("");
  };

  const pickAttachment = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: "*/*"
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const file = result.assets[0];

    uploadMutation.mutate({
      uri: file.uri,
      name: file.name,
      mimeType: file.mimeType
    });
  };

  const handleSignOut = async () => {
    await signOut();
    queryClient.clear();
  };

  return (
    <SafeAreaView style={screenStyles.safeArea}>
      {tasksQuery.isLoading ? (
        <View style={screenStyles.center}>
          <ActivityIndicator />
          <Text style={screenStyles.stateText}>Loading tasks...</Text>
        </View>
      ) : tasksQuery.isError ? (
        <View style={screenStyles.center}>
          <Text style={sharedStyles.error}>
            {getErrorMessage(
              tasksQuery.error,
              "Could not load tasks. Check your connection and try again."
            )}
          </Text>
          <Pressable
            onPress={() => tasksQuery.refetch()}
            style={screenStyles.retryButton}
          >
            <Text style={screenStyles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={screenStyles.scrollContent}
            refreshControl={
              <RefreshControl
                onRefresh={tasksQuery.refetch}
                refreshing={tasksQuery.isRefetching}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            <View style={screenStyles.page}>
              <View style={screenStyles.topBar}>
                <View style={screenStyles.brandRow}>
                  <LogoMark size={56} />
                  <Text style={screenStyles.brandText}>TaskFlow</Text>
                </View>
                <Pressable onPress={handleSignOut} style={screenStyles.logout}>
                  <Text style={screenStyles.logoutText}>Logout</Text>
                </Pressable>
              </View>

              <View style={screenStyles.greetingCard}>
                <Text style={screenStyles.greetingTitle}>
                  Hello{user?.name ? `, ${user.name}` : ""}!
                </Text>
                <Text style={screenStyles.greetingText}>
                  Ready to tackle your goals for today?
                </Text>
              </View>

              <View style={screenStyles.progressCard}>
                <Text style={screenStyles.progressTitle}>Today's Progress</Text>
                <Text style={screenStyles.progressSubtitle}>
                  {pendingTasks.length} tasks left today
                </Text>
                <View style={screenStyles.progressTrack}>
                  <View
                    style={[
                      screenStyles.progressFill,
                      { width: `${completedPercent}%` }
                    ]}
                  />
                </View>
                <Text style={screenStyles.progressPercent}>
                  {completedPercent}% COMPLETED
                </Text>
              </View>

              <View style={screenStyles.filterRow}>
                {filters.map((item) => {
                  const isActive = filter === item.value;

                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => setFilter(item.value)}
                      style={[
                        screenStyles.filterPill,
                        isActive && screenStyles.activeFilterPill
                      ]}
                    >
                      <Text
                        style={[
                          screenStyles.filterText,
                          isActive && screenStyles.activeFilterText
                        ]}
                      >
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {tasks.length === 0 ? (
                <View style={screenStyles.emptyCard}>
                  <Text style={screenStyles.emptyTitle}>No tasks yet</Text>
                  <Text style={screenStyles.emptyText}>
                    Tap the plus button to add your first task.
                  </Text>
                </View>
              ) : (
                <>
                  {filter !== "completed" && (
                    <TaskSection
                      accentColor="#0b55d9"
                      count={pendingTasks.length}
                      emptyText="No pending tasks."
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onEdit={openEditTask}
                      onOpenAttachment={(url) => Linking.openURL(getApiFileUrl(url))}
                      onToggle={(task) => toggleMutation.mutate(task)}
                      tasks={visiblePendingTasks}
                      title="To Do"
                    />
                  )}

                  {filter !== "pending" && (
                    <TaskSection
                      accentColor="#c66a1d"
                      count={completedTasks.length}
                      emptyText="No completed tasks."
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onEdit={openEditTask}
                      onOpenAttachment={(url) => Linking.openURL(getApiFileUrl(url))}
                      onToggle={(task) => toggleMutation.mutate(task)}
                      tasks={visibleCompletedTasks}
                      title="Done"
                    />
                  )}
                </>
              )}
            </View>
          </ScrollView>

          <Pressable
            onPress={openCreateTask}
            style={screenStyles.floatingButton}
          >
            <Text style={screenStyles.floatingButtonText}>+</Text>
          </Pressable>
        </>
      )}

      {(createMutation.isError ||
        uploadMutation.isError ||
        toggleMutation.isError ||
        editMutation.isError ||
        deleteMutation.isError) && (
        <Text style={screenStyles.footerError}>
          {getErrorMessage(
            createMutation.error ||
              uploadMutation.error ||
              toggleMutation.error ||
              editMutation.error ||
              deleteMutation.error,
            "Task change failed. Please try again."
          )}
        </Text>
      )}

      <Modal
        animationType="slide"
        onRequestClose={closeTaskModal}
        transparent
        visible={isAddOpen}
      >
        <View style={screenStyles.modalBackdrop}>
          <View style={screenStyles.modalCard}>
            <Text style={screenStyles.modalTitle}>
              {editingTask ? "Edit task" : "Add task"}
            </Text>
            <TextInput
              onChangeText={setTitle}
              placeholder="Task title"
              returnKeyType="next"
              style={screenStyles.input}
              value={title}
            />
            <TextInput
              multiline
              onChangeText={setDescription}
              placeholder="Description optional"
              style={[screenStyles.input, screenStyles.descriptionInput]}
              value={description}
            />
            <Pressable
              disabled={uploadMutation.isPending}
              onPress={pickAttachment}
              style={screenStyles.attachButton}
            >
              {uploadMutation.isPending ? (
                <ActivityIndicator color="#0b55d9" />
              ) : (
                <Text style={screenStyles.attachText}>
                  {attachmentName ? "Change attachment" : "Attach image or file"}
                </Text>
              )}
            </Pressable>
            {attachmentName ? (
              <View style={screenStyles.attachmentPreview}>
                <Text style={screenStyles.attachmentName} numberOfLines={1}>
                  {attachmentName}
                </Text>
                <Pressable
                  onPress={() => {
                    setAttachmentUrl("");
                    setAttachmentName("");
                    setAttachmentType("");
                  }}
                >
                  <Text style={screenStyles.removeAttachmentText}>Remove</Text>
                </Pressable>
              </View>
            ) : null}
            <View style={screenStyles.modalActions}>
              <Pressable
                onPress={closeTaskModal}
                style={screenStyles.cancelButton}
              >
                <Text style={screenStyles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                disabled={createMutation.isPending || editMutation.isPending}
                onPress={saveTask}
                style={[
                  screenStyles.saveButton,
                  (createMutation.isPending || editMutation.isPending) &&
                    screenStyles.disabledButton
                ]}
              >
                {createMutation.isPending || editMutation.isPending ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={screenStyles.saveText}>Save</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function TaskSection({
  accentColor,
  count,
  emptyText,
  onDelete,
  onEdit,
  onOpenAttachment,
  onToggle,
  tasks,
  title
}: {
  accentColor: string;
  count: number;
  emptyText: string;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onOpenAttachment: (url: string) => void;
  onToggle: (task: Task) => void;
  tasks: Task[];
  title: string;
}) {
  return (
    <View style={screenStyles.section}>
      <View style={screenStyles.sectionHeader}>
        <View style={screenStyles.sectionTitleWrap}>
          <View style={[screenStyles.sectionDot, { backgroundColor: accentColor }]} />
          <Text style={screenStyles.sectionTitle}>{title}</Text>
        </View>
        <Text style={screenStyles.countBadge}>{count}</Text>
      </View>

      {tasks.length === 0 ? (
        <Text style={screenStyles.sectionEmpty}>{emptyText}</Text>
      ) : (
        tasks.map((task) => (
          <TaskCard
            accentColor={accentColor}
            key={task._id}
            onDelete={() => onDelete(task._id)}
            onEdit={() => onEdit(task)}
            onOpenAttachment={() => {
              if (task.attachmentUrl) {
                onOpenAttachment(task.attachmentUrl);
              }
            }}
            onToggle={() => onToggle(task)}
            task={task}
          />
        ))
      )}
    </View>
  );
}

function TaskCard({
  accentColor,
  onDelete,
  onEdit,
  onOpenAttachment,
  onToggle,
  task
}: {
  accentColor: string;
  onDelete: () => void;
  onEdit: () => void;
  onOpenAttachment: () => void;
  onToggle: () => void;
  task: Task;
}) {
  return (
    <View style={[screenStyles.taskCard, { borderLeftColor: accentColor }]}>
      <View style={screenStyles.taskCardTop}>
        <Text style={screenStyles.priorityBadge}>
          {task.completed ? "Done" : "Active"}
        </Text>
        <View style={screenStyles.cardActions}>
          <Pressable onPress={onEdit} style={screenStyles.cardAction}>
            <Text style={screenStyles.editText}>Edit</Text>
          </Pressable>
          <Pressable onPress={onDelete} style={screenStyles.cardAction}>
            <Text style={screenStyles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>

      <Text
        style={[
          screenStyles.taskTitle,
          task.completed && screenStyles.completedTaskTitle
        ]}
      >
        {task.title}
      </Text>
      {task.description ? (
        <Text
          style={[
            screenStyles.taskDescription,
            task.completed && screenStyles.completedTaskDescription
          ]}
        >
          {task.description}
        </Text>
      ) : null}
      {task.attachmentUrl ? (
        <Pressable onPress={onOpenAttachment} style={screenStyles.attachmentLink}>
          <Text style={screenStyles.attachmentLinkText} numberOfLines={1}>
            Attachment: {task.attachmentName || "Open file"}
          </Text>
        </Pressable>
      ) : null}

      <Pressable onPress={onToggle} style={screenStyles.taskFooter}>
        <View
          style={[
            screenStyles.statusCircle,
            task.completed && screenStyles.statusCircleDone
          ]}
        >
          {task.completed ? <Text style={screenStyles.statusCheck}>x</Text> : null}
        </View>
        <Text
          style={[
            screenStyles.statusText,
            task.completed && screenStyles.statusTextDone
          ]}
        >
          {task.completed ? "Completed" : "Mark complete"}
        </Text>
      </Pressable>
    </View>
  );
}

const screenStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f5fc"
  },
  scrollContent: {
    paddingBottom: 38
  },
  page: {
    alignSelf: "center",
    maxWidth: 680,
    padding: 18,
    width: "100%"
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 34
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row"
  },
  brandText: {
    color: "#0b55d9",
    fontSize: 30,
    fontWeight: "900",
    marginLeft: 12
  },
  logout: {
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  logoutText: {
    color: "#30364a",
    fontWeight: "800"
  },
  greetingCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 26,
    padding: 28,
    shadowColor: "#1d2939",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12
  },
  greetingTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 12
  },
  greetingText: {
    color: "#344563",
    fontSize: 18,
    lineHeight: 26
  },
  progressCard: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    marginBottom: 28,
    padding: 26,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 16
  },
  progressTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 10
  },
  progressSubtitle: {
    color: colors.white,
    fontSize: 16,
    marginBottom: 18,
    opacity: 0.95
  },
  progressTrack: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 99,
    height: 8,
    overflow: "hidden"
  },
  progressFill: {
    backgroundColor: colors.white,
    borderRadius: 99,
    height: 8
  },
  progressPercent: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 9
  },
  filterRow: {
    backgroundColor: colors.white,
    borderColor: "#e4e7ef",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 24,
    padding: 4
  },
  filterPill: {
    alignItems: "center",
    borderRadius: 9,
    flex: 1,
    paddingVertical: 10
  },
  activeFilterPill: {
    backgroundColor: "#0b55d9"
  },
  filterText: {
    color: colors.muted,
    fontWeight: "800"
  },
  activeFilterText: {
    color: colors.white
  },
  section: {
    marginBottom: 26
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  sectionTitleWrap: {
    alignItems: "center",
    flexDirection: "row"
  },
  sectionDot: {
    borderRadius: 5,
    height: 9,
    marginRight: 10,
    width: 9
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900"
  },
  countBadge: {
    backgroundColor: "#e8ebf5",
    borderRadius: 12,
    color: "#344563",
    fontWeight: "800",
    minWidth: 26,
    overflow: "hidden",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: "center"
  },
  sectionEmpty: {
    color: colors.muted,
    marginBottom: 12,
    marginLeft: 19
  },
  emptyCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 28
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6
  },
  emptyText: {
    color: colors.muted,
    textAlign: "center"
  },
  taskCard: {
    backgroundColor: colors.white,
    borderLeftWidth: 4,
    borderRadius: 13,
    marginBottom: 16,
    padding: 20,
    shadowColor: "#1d2939",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12
  },
  taskCardTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  priorityBadge: {
    backgroundColor: "#e3edf9",
    borderRadius: 5,
    color: "#344563",
    fontWeight: "700",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  cardActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  cardAction: {
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  editText: {
    color: "#0b55d9",
    fontWeight: "800"
  },
  deleteText: {
    color: colors.danger,
    fontWeight: "800"
  },
  taskTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8
  },
  completedTaskTitle: {
    color: colors.muted,
    textDecorationLine: "line-through"
  },
  taskDescription: {
    color: "#344563",
    fontSize: 16,
    lineHeight: 24
  },
  completedTaskDescription: {
    color: colors.muted,
    textDecorationLine: "line-through"
  },
  attachmentLink: {
    backgroundColor: "#eef4ff",
    borderRadius: 8,
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  attachmentLinkText: {
    color: "#0b55d9",
    fontWeight: "800"
  },
  taskFooter: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 18
  },
  statusCircle: {
    alignItems: "center",
    borderColor: "#c9d2df",
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    justifyContent: "center",
    marginRight: 8,
    width: 18
  },
  statusCircleDone: {
    backgroundColor: "#0b55d9",
    borderColor: "#0b55d9"
  },
  statusCheck: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 12
  },
  statusText: {
    color: "#0b55d9",
    fontWeight: "800"
  },
  statusTextDone: {
    color: colors.muted
  },
  floatingButton: {
    alignItems: "center",
    backgroundColor: "#2563eb",
    borderRadius: 18,
    bottom: 26,
    height: 62,
    justifyContent: "center",
    position: "absolute",
    right: 26,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: 62
  },
  floatingButtonText: {
    color: colors.white,
    fontSize: 42,
    fontWeight: "300",
    lineHeight: 48
  },
  center: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  stateText: {
    color: colors.muted,
    marginTop: 10
  },
  retryButton: {
    borderColor: colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 18,
    paddingVertical: 10
  },
  retryText: {
    color: colors.primary,
    fontWeight: "800"
  },
  footerError: {
    backgroundColor: "#fee2e2",
    color: colors.danger,
    padding: 12,
    textAlign: "center"
  },
  modalBackdrop: {
    backgroundColor: "rgba(17,24,39,0.35)",
    flex: 1,
    justifyContent: "flex-end"
  },
  modalCard: {
    alignSelf: "center",
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxWidth: 680,
    padding: 22,
    width: "100%"
  },
  modalTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16
  },
  input: {
    backgroundColor: "#fbfaff",
    borderColor: "#c7cbe0",
    borderRadius: 10,
    borderWidth: 1.5,
    color: colors.text,
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingVertical: 14
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top"
  },
  attachButton: {
    alignItems: "center",
    borderColor: "#0b55d9",
    borderRadius: 10,
    borderWidth: 1.5,
    marginBottom: 12,
    paddingVertical: 13
  },
  attachText: {
    color: "#0b55d9",
    fontWeight: "900"
  },
  attachmentPreview: {
    alignItems: "center",
    backgroundColor: "#eef4ff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  attachmentName: {
    color: "#243b5a",
    flex: 1,
    fontWeight: "700",
    marginRight: 10
  },
  removeAttachmentText: {
    color: colors.danger,
    fontWeight: "800"
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4
  },
  cancelButton: {
    alignItems: "center",
    borderColor: "#c7cbe0",
    borderRadius: 10,
    borderWidth: 1.5,
    flex: 1,
    paddingVertical: 14
  },
  cancelText: {
    color: "#30364a",
    fontWeight: "900"
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#0b55d9",
    borderRadius: 10,
    flex: 1,
    paddingVertical: 14
  },
  saveText: {
    color: colors.white,
    fontWeight: "900"
  },
  disabledButton: {
    opacity: 0.7
  }
});
