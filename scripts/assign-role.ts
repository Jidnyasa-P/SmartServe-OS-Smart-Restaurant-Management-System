import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let projectId = 'independent-acumen-fbcl8';
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.projectId) projectId = config.projectId;
  }
} catch (e) {
  console.warn('Could not read firebase-applet-config.json, using fallback projectId:', projectId);
}

if (!getApps().length) {
  initializeApp({
    projectId: projectId,
  });
}

const db = getFirestore();

async function assignRole(targetUidOrEmail: string, newRole: string) {
  const validRoles = ['customer', 'staff', 'kitchen', 'manager', 'admin'];
  if (!validRoles.includes(newRole)) {
    console.error(`❌ Invalid role '${newRole}'. Allowed roles: ${validRoles.join(', ')}`);
    process.exit(1);
  }

  let uid = targetUidOrEmail;

  if (targetUidOrEmail.includes('@')) {
    const emailToFind = targetUidOrEmail.trim().toLowerCase();
    const userQuery = await db.collection('users').where('email', '==', emailToFind).get();

    if (userQuery.empty) {
      console.error(`❌ No registered user found in Firestore for email: '${emailToFind}'`);
      process.exit(1);
    }

    uid = userQuery.docs[0].id;
  }

  const userRef = db.collection('users').doc(uid);
  const userSnap = await userRef.get();

  if (!userSnap.exists) {
    console.error(`❌ User document '/users/${uid}' does not exist in Firestore.`);
    process.exit(1);
  }

  await userRef.set({
    role: newRole,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  console.log(`✅ Successfully assigned role '${newRole}' to user '${targetUidOrEmail}' (UID: ${uid}) in Firestore.`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: npx tsx scripts/assign-role.ts <uid_or_email> <role>');
  console.log('Roles: customer | staff | kitchen | manager | admin');
  process.exit(0);
}

assignRole(args[0], args[1]);
