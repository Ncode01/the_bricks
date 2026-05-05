"use client";

import { useEffect } from "react";
import { EditorShell } from "./editor-shell";
import { usePlayback } from "./hooks/use-playback";
import { useEditorStore } from "@/lib/editor/store";
import {
  loadMediaItems,
  loadProjectState,
  saveMediaItems,
  saveProjectState
} from "@/lib/editor/persistence";
import {
  getPortfolioSequence,
  portfolioMedia
} from "@/lib/editor/portfolio-data";

export function EditorApp() {
  usePlayback();

  const setMediaItems = useEditorStore((state) => state.setMediaItems);
  const setProjectState = useEditorStore((state) => state.setProjectState);
  const setActiveSequenceId = useEditorStore(
    (state) => state.setActiveSequenceId
  );

  useEffect(() => {
    let active = true;

    const hydrate = async () => {
      const [media, project] = await Promise.all([
        loadMediaItems().catch(() => []),
        loadProjectState().catch(() => null)
      ]);

      if (!active) {
        return;
      }

      const mergedMedia = new Map(
        [...portfolioMedia, ...media].map((item) => [item.id, item])
      );
      setMediaItems(Array.from(mergedMedia.values()));

      if (project) {
        const sequenceId = project.sequenceId ?? project.sequence?.id;
        setProjectState({
          ...project,
          markers: project.markers ?? [],
          sequenceId
        });
        setActiveSequenceId(sequenceId ?? project.sequence.id);
        return;
      }

      const seed = getPortfolioSequence("seq-main");
      setProjectState({
        sequence: seed.sequence,
        tracks: seed.tracks,
        clips: seed.clips,
        markers: seed.markers,
        sequenceId: seed.id
      });
      setActiveSequenceId(seed.id);
    };

    hydrate();

    return () => {
      active = false;
    };
  }, [setMediaItems, setProjectState]);

  useEffect(() => {
    let projectTimer: number | undefined;
    let mediaTimer: number | undefined;

    const unsubscribeProject = useEditorStore.subscribe(() => {
      const snapshot = useEditorStore.getState();
      const payload = {
        sequence: snapshot.sequence,
        tracks: snapshot.tracks,
        clips: snapshot.clips,
        markers: snapshot.markers,
        sequenceId: snapshot.activeSequenceId
      };

      if (projectTimer) {
        window.clearTimeout(projectTimer);
      }
      projectTimer = window.setTimeout(() => {
        saveProjectState(payload).catch(() => null);
      }, 600);
    });

    const unsubscribeMedia = useEditorStore.subscribe(() => {
      const media = useEditorStore.getState().media;
      if (mediaTimer) {
        window.clearTimeout(mediaTimer);
      }
      mediaTimer = window.setTimeout(() => {
        saveMediaItems(media).catch(() => null);
      }, 800);
    });

    return () => {
      unsubscribeProject();
      unsubscribeMedia();
      if (projectTimer) {
        window.clearTimeout(projectTimer);
      }
      if (mediaTimer) {
        window.clearTimeout(mediaTimer);
      }
    };
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }

      const state = useEditorStore.getState();
      const step = 1 / state.sequence.fps;

      if (event.code === "Space") {
        event.preventDefault();
        state.setPlaying(!state.isPlaying);
      }

      if (event.code === "ArrowRight") {
        event.preventDefault();
        state.setPlayhead(state.playhead + step);
      }

      if (event.code === "ArrowLeft") {
        event.preventDefault();
        state.setPlayhead(Math.max(0, state.playhead - step));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return <EditorShell />;
}
