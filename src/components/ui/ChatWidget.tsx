import { useEffect, useRef } from 'react';

const DEFAULT_WEBHOOK_URL =
  'https://pdftool.app.n8n.cloud/webhook/91199e24-24b0-4213-984f-aa8db29f92d5/chat';
const CDN_CSS_URL = 'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
const CDN_BUNDLE_URL =
  'https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js';

let isChatBootstrapping = false;

/**
 * Ensures the n8n chat stylesheet is injected into <head> safely.
 */
function ensureChatStyles() {
  if (typeof document === 'undefined') return;

  // Check if link tag already exists
  if (!document.querySelector('link[data-n8n-chat-css]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CDN_CSS_URL;
    link.setAttribute('data-n8n-chat-css', 'true');
    document.head.appendChild(link);
  }

  // Also lazily try local package CSS import if available
  import('@n8n/chat/dist/style.css').catch(() => {
    // Ignore bundler resolution fallback since CDN link is already injected
  });
}

/**
 * Floating n8n chat widget – Vision Giants Assistant.
 *
 * • 100% SSR-safe (guards against window/document access during SSR).
 * • Client-only initialization inside useEffect with StrictMode/HMR double-invoke protection.
 * • Configured with explicit POST method, chatInputKey, chatSessionKey, and loadPreviousSession: false.
 * • Reliable fallback: tries local @n8n/chat npm package first; falls back to CDN ES bundle.
 * • Detailed console logging so any initialization or network errors are immediately visible.
 */
export function ChatWidget() {
  const initialized = useRef(false);

  useEffect(() => {
    // SSR guard
    if (typeof window === 'undefined') return;

    // Check if the chat DOM already exists and is mounted
    const existingChatContainer = document.getElementById('n8n-chat');
    if (existingChatContainer && existingChatContainer.children.length > 0) {
      return;
    }

    if (initialized.current || isChatBootstrapping) return;
    initialized.current = true;
    isChatBootstrapping = true;

    // Ensure CSS stylesheet is present in <head>
    ensureChatStyles();

    const webhookUrl =
      (import.meta.env.VITE_CHAT_WEBHOOK_URL as string) || DEFAULT_WEBHOOK_URL;

    const chatConfig = {
      webhookUrl,
      mode: 'window' as const,
      showWelcomeScreen: false,
      loadPreviousSession: false,
      chatInputKey: 'chatInput',
      chatSessionKey: 'sessionId',
      webhookConfig: {
        method: 'POST' as const,
        headers: {},
      },
      initialMessages: [
        'Hi! 👋 Ask me anything about VGiants services, courses or careers.',
      ],
      i18n: {
        en: {
          title: 'VGiants Assistant',
          subtitle: 'Ask us anything',
          footer: '',
          getStarted: 'New chat',
          inputPlaceholder: 'Type your question...',
          closeButtonTooltip: 'Close chat',
        },
      },
    };

    /**
     * Loads createChat either from local package or from CDN
     */
    async function initChat() {
      try {
        // Attempt 1: load local npm package
        const mod = await import('@n8n/chat');
        if (typeof mod.createChat === 'function') {
          mod.createChat(chatConfig);
          console.info('[ChatWidget] n8n chat widget mounted successfully (via npm package).');
          return;
        }
      } catch (err) {
        console.warn('[ChatWidget] Local @n8n/chat import failed, trying CDN bundle:', err);
      }

      try {
        // Attempt 2: fallback to official CDN ES module
        const cdnMod = (await import(/* @vite-ignore */ CDN_BUNDLE_URL)) as {
          createChat?: (config: typeof chatConfig) => void;
        };
        if (typeof cdnMod.createChat === 'function') {
          cdnMod.createChat(chatConfig);
          console.info('[ChatWidget] n8n chat widget mounted successfully (via CDN bundle).');
          return;
        }
        throw new Error('createChat function not found in CDN module');
      } catch (cdnErr) {
        console.error(
          '[ChatWidget] Failed to initialize n8n chat widget. Please check network/CORS settings:',
          cdnErr
        );
      } finally {
        isChatBootstrapping = false;
      }
    }

    initChat();
  }, []);

  return null;
}
