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
  ReportItem
} from '../types';
import {
  INITIAL_POSTS,
  INITIAL_USERS,
  INITIAL_SCHOOLS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_CLUBS,
  INITIAL_CHALLENGES,
  INITIAL_EVENTS,
  INITIAL_OPPORTUNITIES,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS
} from '../data/initialData';

// Sync seed data to Firestore if collections are empty
export async function seedFirestoreInitialData() {
  try {
    const postsCol = collection(db, 'posts');
    const snap = await getDocs(query(postsCol, limit(1)));
    if (snap.empty) {
      console.log('Bootstrapping initial demo data to Firestore...');
      // Seed posts
      for (const p of INITIAL_POSTS) {
        await setDoc(doc(db, 'posts', p.id), {
          ...p,
          timestamp: Date.now()
        });
      }
      // Seed schools
      for (const s of INITIAL_SCHOOLS) {
        await setDoc(doc(db, 'schools', s.id), s);
      }
      // Seed users
      for (const u of INITIAL_USERS) {
        await setDoc(doc(db, 'users', u.id), u);
      }
      // Seed clubs
      for (const c of INITIAL_CLUBS) {
        await setDoc(doc(db, 'clubs', c.id), c);
      }
      // Seed stories
      for (const st of INITIAL_STORIES) {
        await setDoc(doc(db, 'stories', st.id), {
          ...st,
          timestamp: Date.now()
        });
      }
      // Seed reels
      for (const r of INITIAL_REELS) {
        await setDoc(doc(db, 'reels', r.id), r);
      }
      // Seed challenges
      for (const ch of INITIAL_CHALLENGES) {
        await setDoc(doc(db, 'challenges', ch.id), ch);
      }
      // Seed events
      for (const ev of INITIAL_EVENTS) {
        await setDoc(doc(db, 'events', ev.id), ev);
      }
      // Seed opportunities
      for (const opp of INITIAL_OPPORTUNITIES) {
        await setDoc(doc(db, 'opportunities', opp.id), opp);
      }
      // Seed conversations
      for (const conv of INITIAL_CONVERSATIONS) {
        await setDoc(doc(db, 'conversations', conv.id), conv);
      }
      // Seed notifications
      for (const notif of INITIAL_NOTIFICATIONS) {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      }
      // Seed reports
      for (const rep of INITIAL_REPORTS) {
        await setDoc(doc(db, 'reports', rep.id), rep);
      }
      console.log('Initial Firestore seed complete!');
    }
  } catch (err) {
    console.warn('Firebase seed notice (using local offline fallback):', err);
  }
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
        if (!snapshot.empty) {
          const list: Post[] = [];
          snapshot.forEach((d) => {
            list.push({ ...d.data(), id: d.id } as Post);
          });
          list.sort((a, b) => {
            const timeA = (a as any).timestamp || 0;
            const timeB = (b as any).timestamp || 0;
            return timeB - timeA;
          });
          onUpdate(list);
        }
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
        if (!snapshot.empty) {
          const list: Story[] = [];
          snapshot.forEach((d) => {
            list.push({ ...d.data(), id: d.id } as Story);
          });
          list.sort((a, b) => {
            const timeA = (a as any).timestamp || 0;
            const timeB = (b as any).timestamp || 0;
            return timeB - timeA;
          });
          onUpdate(list);
        }
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
        if (!snapshot.empty) {
          const list: Reel[] = [];
          snapshot.forEach((d) => {
            list.push({ ...d.data(), id: d.id } as Reel);
          });
          onUpdate(list);
        }
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
        if (!snapshot.empty) {
          const list: Conversation[] = [];
          snapshot.forEach((d) => {
            list.push({ ...d.data(), id: d.id } as Conversation);
          });
          onUpdate(list);
        }
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
        if (!snapshot.empty) {
          const list: Comment[] = [];
          snapshot.forEach((d) => {
            list.push({ ...d.data(), id: d.id } as Comment);
          });
          onUpdate(list);
        }
      },
      (error) => console.warn('Firestore comments snapshot warning:', error)
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
