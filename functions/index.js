const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.addAdminRole = functions.https.onCall(async (data, context) => {
  // Só usuários logados como admins podem chamar (exemplo simples)
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'Não autenticado.');
  }

  // (Opcional) Verifica se quem está chamando já é admin para evitar abuso
  const callerToken = await admin.auth().getUser(context.auth.uid);
  if (!callerToken.customClaims || !callerToken.customClaims.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Sem permissão para adicionar admin.');
  }

  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email não fornecido.');
  }

  // Busca usuário pelo email
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    return { message: `Usuário ${email} agora é admin!` };
  } catch (error) {
    throw new functions.https.HttpsError('not-found', `Usuário não encontrado: ${email}`);
  }
});
