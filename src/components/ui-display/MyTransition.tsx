import { Fragment, type ReactElement } from "react";
import { Transition } from "@headlessui/react";

export const MyTransition = () => {
  return <></>;
};

const ScaleAndOpacity = ({
  children,
  show,
}: {
  children: ReactElement;
  show?: boolean;
}) => (
  <Transition
    as={Fragment}
    show={show}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition>
);

MyTransition.ScaleAndOpacity = ScaleAndOpacity;

const Opacity = ({ children }: { children: ReactElement }) => (
  <Transition
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    {children}
  </Transition>
);

MyTransition.Opacity = Opacity;

const Child = () => {
  return <></>;
};

MyTransition.Child = Child;

const ChildScaleAndOpacity = ({ children }: { children: ReactElement }) => (
  <Transition.Child
    as={Fragment}
    enter="transition ease-out duration-100"
    enterFrom="transform opacity-0 scale-95"
    enterTo="transform opacity-100 scale-100"
    leave="transition ease-in duration-75"
    leaveFrom="transform opacity-100 scale-100"
    leaveTo="transform opacity-0 scale-95"
  >
    {children}
  </Transition.Child>
);

Child.ScaleAndOpacity = ChildScaleAndOpacity;

const ChildOpacity = ({ children }: { children: ReactElement }) => (
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    {children}
  </Transition.Child>
);

Child.Opacity = ChildOpacity;
