import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Post,
  Comment,
  Story,
  Reel,
  GroupClub,
  Challenge,
  CampusEvent,
  Opportunity,
  Conversation,
  NotificationItem,
  User,
  School,
  ReportItem,
  SchoolStaffRecord,
  ConnectionRequest
} from '../types';

// No seeded dummy data - production relies solely on real user accounts and creations
export async function seedFirestoreInitialData(): Promise<void> {
  // Intentionally empty: do not seed any dummy users, posts, or content
}

// -------------------------------------------------------------
// Real-time Subscriptions
// -------------------------------------------------------------

export function subscribeToPosts(onUpdate: (posts: Post[]) => void) {
  try {
    const q = query(collection(db, 'posts'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Post[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Post);
        });
        // Fix #17: sort by createdAt ISO string (newest first); posts use createdAt not timestamp
        list.sort((a, b) => {
          const tA = a.createdAt || '';
          const tB = b.createdAt || '';
          return tB.localeCompare(tA);
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('Firestore posts snapshot warning:', error);
      }
    );
  } catch (e) {
    console.warn('subscribeToPosts error:', e);
    return () => {};
  }
}

export function subscribeToStories(onUpdate: (stories: Story[]) => void) {
  try {
    const q = query(collection(db, 'stories'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Story[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Story);
        });
        // Fix #17: sort by createdAt ISO string (newest first)
        list.sort((a, b) => {
          const tA = a.createdAt || '';
          const tB = b.createdAt || '';
          return tB.localeCompare(tA);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore stories snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeToReels(onUpdate: (reels: Reel[]) => void) {
  try {
    const q = query(collection(db, 'reels'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Reel[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Reel);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore reels snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeToConversations(onUpdate: (conversations: Conversation[]) => void) {
  try {
    const q = query(collection(db, 'conversations'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Conversation[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Conversation);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore conversations snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeToComments(onUpdate: (comments: Comment[]) => void) {
  try {
    const q = query(collection(db, 'comments'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Comment[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as Comment);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore comments snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeToSchools(onUpdate: (schools: School[]) => void) {
  try {
    const q = query(collection(db, 'schools'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: School[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as School);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore schools snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeToClubs(onUpdate: (clubs: GroupClub[]) => void) {
  try {
    const q = query(collection(db, 'clubs'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: GroupClub[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as GroupClub);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore clubs snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeToEvents(onUpdate: (events: CampusEvent[]) => void) {
  try {
    const q = query(collection(db, 'events'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: CampusEvent[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as CampusEvent);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore events snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export function subscribeToUsers(onUpdate: (users: User[]) => void) {
  try {
    const q = query(collection(db, 'users'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: User[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as User);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore users snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

// -------------------------------------------------------------
// CRUD Operations
// -------------------------------------------------------------

export async function savePostToFirebase(post: Post) {
  try {
    await setDoc(doc(db, 'posts', post.id), {
      ...post,
      timestamp: Date.now()
    });
  } catch (err) {
    console.warn('savePostToFirebase offline fallback:', err);
  }
}

export async function updatePostInFirebase(postId: string, partial: Partial<Post>) {
  try {
    await updateDoc(doc(db, 'posts', postId), partial);
  } catch (err) {
    console.warn('updatePostInFirebase offline fallback:', err);
  }
}

export async function deletePostFromFirebase(postId: string) {
  try {
    await deleteDoc(doc(db, 'posts', postId));
  } catch (err) {
    console.warn('deletePostFromFirebase offline fallback:', err);
  }
}

export async function saveCommentToFirebase(comment: Comment) {
  try {
    await setDoc(doc(db, 'comments', comment.id), {
      ...comment,
      timestamp: Date.now()
    });
  } catch (err) {
    console.warn('saveCommentToFirebase fallback:', err);
  }
}

export async function deleteCommentFromFirebase(commentId: string) {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (err) {
    console.warn('deleteCommentFromFirebase fallback:', err);
  }
}

export async function saveStoryToFirebase(story: Story) {
  try {
    await setDoc(doc(db, 'stories', story.id), {
      ...story,
      timestamp: Date.now()
    });
  } catch (err) {
    console.warn('saveStoryToFirebase offline fallback:', err);
  }
}

export async function saveReelToFirebase(reel: Reel) {
  try {
    await setDoc(doc(db, 'reels', reel.id), reel);
  } catch (err) {
    console.warn('saveReelToFirebase offline fallback:', err);
  }
}

export async function updateReelInFirebase(reelId: string, partial: Partial<Reel>) {
  try {
    await updateDoc(doc(db, 'reels', reelId), partial);
  } catch (err) {
    console.warn('updateReelInFirebase fallback:', err);
  }
}

export async function updateClubInFirebase(clubId: string, partial: Partial<GroupClub>) {
  try {
    await updateDoc(doc(db, 'clubs', clubId), partial);
  } catch (err) {
    console.warn('updateClubInFirebase fallback:', err);
  }
}

export async function updateChallengeInFirebase(challengeId: string, partial: Partial<Challenge>) {
  try {
    await updateDoc(doc(db, 'challenges', challengeId), partial);
  } catch (err) {
    console.warn('updateChallengeInFirebase fallback:', err);
  }
}

export async function updateEventInFirebase(eventId: string, partial: Partial<CampusEvent>) {
  try {
    await updateDoc(doc(db, 'events', eventId), partial);
  } catch (err) {
    console.warn('updateEventInFirebase fallback:', err);
  }
}

export async function saveEventToFirebase(event: CampusEvent) {
  try {
    await setDoc(doc(db, 'events', event.id), event);
  } catch (err) {
    console.warn('saveEventToFirebase fallback:', err);
  }
}

export async function saveConversationToFirebase(conversation: Conversation) {
  try {
    await setDoc(doc(db, 'conversations', conversation.id), conversation);
  } catch (err) {
    console.warn('saveConversationToFirebase fallback:', err);
  }
}

export async function saveReportToFirebase(report: ReportItem) {
  try {
    await setDoc(doc(db, 'reports', report.id), report);
  } catch (err) {
    console.warn('saveReportToFirebase fallback:', err);
  }
}

export async function saveSchoolToFirebase(school: School) {
  try {
    await setDoc(doc(db, 'schools', school.id), school);
  } catch (err) {
    console.warn('saveSchoolToFirebase fallback:', err);
  }
}

export async function saveClubToFirebase(club: GroupClub) {
  try {
    await setDoc(doc(db, 'clubs', club.id), club);
  } catch (err) {
    console.warn('saveClubToFirebase fallback:', err);
  }
}

export async function saveChallengeToFirebase(challenge: Challenge) {
  try {
    await setDoc(doc(db, 'challenges', challenge.id), challenge);
  } catch (err) {
    console.warn('saveChallengeToFirebase fallback:', err);
  }
}

export async function saveUserToFirebase(user: User) {
  try {
    await setDoc(doc(db, 'users', user.id), user);
  } catch (err) {
    console.warn('saveUserToFirebase fallback:', err);
  }
}

export async function updateUserInFirebase(userId: string, partial: Partial<User>) {
  try {
    await updateDoc(doc(db, 'users', userId), partial);
  } catch (err) {
    console.warn('updateUserInFirebase fallback:', err);
  }
}

export async function getUserFromFirebase(userId: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  } catch (err) {
    console.warn('getUserFromFirebase fallback:', err);
    return null;
  }
}

export async function deleteUserFromFirebase(userId: string) {
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (err) {
    console.warn('deleteUserFromFirebase fallback:', err);
  }
}

export async function deleteSchoolFromFirebase(schoolId: string) {
  try {
    await deleteDoc(doc(db, 'schools', schoolId));
  } catch (err) {
    console.warn('deleteSchoolFromFirebase fallback:', err);
  }
}

export async function deleteReelFromFirebase(reelId: string) {
  try {
    await deleteDoc(doc(db, 'reels', reelId));
  } catch (err) {
    console.warn('deleteReelFromFirebase fallback:', err);
  }
}

export async function deleteStoryFromFirebase(storyId: string) {
  try {
    await deleteDoc(doc(db, 'stories', storyId));
  } catch (err) {
    console.warn('deleteStoryFromFirebase fallback:', err);
  }
}

export async function deleteClubFromFirebase(clubId: string) {
  try {
    await deleteDoc(doc(db, 'clubs', clubId));
  } catch (err) {
    console.warn('deleteClubFromFirebase fallback:', err);
  }
}

// -------------------------------------------------------------
// School Staff Authorizations
// -------------------------------------------------------------

export function subscribeToSchoolStaff(onUpdate: (staff: SchoolStaffRecord[]) => void) {
  try {
    const q = query(collection(db, 'schoolStaff'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: SchoolStaffRecord[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as SchoolStaffRecord);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore schoolStaff snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export async function saveSchoolStaffToFirebase(staff: SchoolStaffRecord) {
  try {
    await setDoc(doc(db, 'schoolStaff', staff.id), staff);
  } catch (err) {
    console.warn('saveSchoolStaffToFirebase fallback:', err);
  }
}

export async function deleteSchoolStaffFromFirebase(staffId: string) {
  try {
    await deleteDoc(doc(db, 'schoolStaff', staffId));
  } catch (err) {
    console.warn('deleteSchoolStaffFromFirebase fallback:', err);
  }
}

// -------------------------------------------------------------
// Notifications & Connection Requests
// -------------------------------------------------------------

export function subscribeToNotifications(onUpdate: (notifications: NotificationItem[]) => void) {
  try {
    const q = query(collection(db, 'notifications'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: NotificationItem[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as NotificationItem);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore notifications snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export async function saveNotificationToFirebase(notif: NotificationItem) {
  try {
    await setDoc(doc(db, 'notifications', notif.id), notif);
  } catch (err) {
    console.warn('saveNotificationToFirebase fallback:', err);
  }
}

export async function updateNotificationInFirebase(notifId: string, partial: Partial<NotificationItem>) {
  try {
    await updateDoc(doc(db, 'notifications', notifId), partial);
  } catch (err) {
    console.warn('updateNotificationInFirebase fallback:', err);
  }
}

export function subscribeToConnectionRequests(onUpdate: (requests: ConnectionRequest[]) => void) {
  try {
    const q = query(collection(db, 'connectionRequests'));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: ConnectionRequest[] = [];
        snapshot.forEach((d) => {
          list.push({ ...d.data(), id: d.id } as ConnectionRequest);
        });
        onUpdate(list);
      },
      (error) => console.warn('Firestore connectionRequests snapshot warning:', error)
    );
  } catch (e) {
    return () => {};
  }
}

export async function saveConnectionRequestToFirebase(req: ConnectionRequest) {
  try {
    await setDoc(doc(db, 'connectionRequests', req.id), req);
  } catch (err) {
    console.warn('saveConnectionRequestToFirebase fallback:', err);
  }
}

export async function updateConnectionRequestInFirebase(reqId: string, partial: Partial<ConnectionRequest>) {
  try {
    await updateDoc(doc(db, 'connectionRequests', reqId), partial);
  } catch (err) {
    console.warn('updateConnectionRequestInFirebase fallback:', err);
  }
}

export async function deleteConnectionRequestFromFirebase(reqId: string) {
  try {
    await deleteDoc(doc(db, 'connectionRequests', reqId));
  } catch (err) {
    console.warn('deleteConnectionRequestFromFirebase fallback:', err);
  }
}

