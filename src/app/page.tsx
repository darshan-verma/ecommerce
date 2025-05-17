"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/home');
  return null;
}
