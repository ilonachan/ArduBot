<?php
   header("Content-type: text/html; charset=ISO-8859-1");

   if($_GET["comm"] == "move-Up-1")
   {
      echo "Moving up";
   }
   else if($_GET["comm"] == "move-Up-0")
   {
      echo "Stopping up";
   }
   else if($_GET["comm"] == "move-Down-1")
   {
      echo "Moving down";
   }
   else if($_GET["comm"] == "move-Down-0")
   {
      echo "Stopping down";
   }
   else if($_GET["comm"] == "move-Left-1")
   {
      echo "Moving left";
   }
   else if($_GET["comm"] == "move-Left-0")
   {
      echo "Stopping left";
   }
   else if($_GET["comm"] == "move-Right-1")
   {
      echo "Moving right";
   }
   else if($_GET["comm"] == "move-Right-0")
   {
      echo "Stopping right";
   }
   else if($_GET["comm"] == "refresh")
	{
		echo "Status: OK";
	}
	else if($_GET["comm"] == "display")
	{
		echo "Set display text to '" . $_GET["setto"] . "'";
	}
?>