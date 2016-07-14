#!/bin/bash

#sudo apt-get install xautomation


function fn1(){
	xte 'key Up';
	echo 'k_U';
}

function fn2(){
	xte 'key Down';
	echo 'k_D';
}

function fn3(){
	xte 'key Right'
	echo 'k_R';
}

function fn4(){
	xte 'key Left';
	echo 'k_L';
}

function fn5(){
	xte 'key Page_Down';
	echo 'k_P_D';
}

function fn6(){
	xte 'key Page_Up';
	echo 'k_P_U';
}

function fn7(){
	xte 'key Escape';
	echo 'k_Es';
}

function fn8(){
	xte 'key Shift_L';
	echo 'k_S_L';
}

function fn9(){
	xte 'key Shift_R';
	echo 'k_S_R';
}

function fn10(){
	xte 'key Control_L';
	echo 'k_C_L';
}

function fn11(){
	xte 'key Control_R';
	echo 'k_C_R';
}

function fn12(){
	xte 'key Home';
	echo 'k_H';
}

function fn13(){
	xte 'key End';
	echo 'k_E';
}


function fn14(){
	XX=$((RANDOM%1000+300));
	#YY=$((RANDOM%600+10));
	YY=400;
	xte "mousemove $XX $YY" 'mouseclick 1';
	echo 'M_C';
}

function fn15(){
	xte "keydown Control_L" "key Tab" "keyup Control_L"
	echo 'ctrl+Tab';
}

function fn16(){
	xte "keydown Alt_L" "key Tab" "keyup Alt_L"
	echo 'Alt+Tab';
}



while :
	do
		TT=$((RANDOM%5+1));
		FF=$((RANDOM%16+1));
		fn$((FF))
		sleep $TT

	done
